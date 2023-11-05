# frozen_string_literal: true

class Rclone
  attr_reader :file_id, :remote, :destination_path, :options

  class << self
    def remotes
      rclone_config = `cat #{rclone_custom_config}`
      rclone_config.scan(/\[(.*?)\]/).flatten
    end

    def directories(remote, destination_path)
      paths = JSON.parse(`rclone --config=#{cloned_config} lsjson --dirs-only '#{remote}':'#{destination_path}'`)
      paths.map { |path| path.transform_keys! { |key| key.to_s.underscore }.symbolize_keys! }
      paths.each { |path| path[:path] = "#{destination_path}/#{path[:path]}" }
      paths
    rescue StandardError
      []
    end

    def clone(file_id, remote, destination_path = '/', options = {})
      transfer = RcloneTransfer.find_by_file_id_and_remote(file_id, remote)
      return if transfer&.queued? || transfer&.processing?

      rclone = new(file_id, remote, destination_path, options)
      rclone.update_progress

      job = rclone.execute
      rclone.update_progress({ job_id: job.id })
    end

    # Rclone attempts to move the config file when modifying it and that doesn't play nicely with Docker
    # https://github.com/rclone/rclone/issues/6656
    def cloned_config
      cache_cloned_config = ".cache/rclone_#{Time.current.to_i}.conf"
      `cp #{rclone_custom_config} #{cache_cloned_config}`
      cache_cloned_config
    end

    private

    def rclone_custom_config
      ENV.fetch('RCLONE_CUSTOM_CONFIG', '/var/workspace/.config/rclone/rclone.conf')
    end
  end

  def initialize(file_id, remote, destination_path = '/', options = {})
    @file_id = file_id
    @remote = remote
    @destination_path = destination_path
    @options = options
  end

  def execute
    IO.popen(command) do |io|
      puts command

      # Read and print each line of stdout as it becomes available
      io.each_line do |line|
        raise 'Canceled' if RcloneTransfer.find_by_file_id(file_id).blank?
        next unless line.match?('ETA')

        progress = line.split('Transferred:')[1].strip
        update_progress({ progress: progress })
      end
    end
  end
  handle_asynchronously :execute

  def update_progress(options = {})
    transfer_data = {
      file_name: file_name,
      remote: remote,
      destination_path: destination_path,
      progress: options[:progress] || '',
    }

    transfer_data[:job_id] = options[:job_id] if options[:job_id].present?

    RcloneTransfer.update_progress(file_id, remote, transfer_data)
  end

  private

  def command
    @command ||= "rclone --config=#{Rclone.cloned_config} copyurl --progress '#{direct_link}' '#{remote}':'#{destination_path}/#{file_name}'"
  end

  def file_name
    options[:file_name].presence || CGI.unescape(direct_link.split('/').last)
  end

  def direct_link
    return @direct_link if @direct_link

    fshare = Fshare.new
    fshare.login!
    response = fshare.direct_link(file_id)
    @direct_link = response.body&.dig(:location).to_s
  end
end
