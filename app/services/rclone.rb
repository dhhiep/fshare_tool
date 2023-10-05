# frozen_string_literal: true

class Rclone
  attr_reader :file_id, :remote, :destination_path, :options

  class << self
    def clone(file_id, remote, destination_path = '/', options = {})
      transfer = RcloneTransfer.find_by_file_id(file_id)
      return if transfer&.queued? || transfer&.processing?

      rclone = new(file_id, remote, destination_path, options)
      job = rclone.execute
      rclone.update_progress({ job_id: job.id })
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

    RcloneTransfer.update_progress(file_id, transfer_data)
  end

  private

  def command
    @command ||= "rclone copyurl --progress '#{direct_link}' #{remote}:'#{destination_path}/#{file_name}'"
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
