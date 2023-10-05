# frozen_string_literal: true

class FshareFolderV3Serializer
  include ActionView::Helpers::NumberHelper

  def self.call(data)
    new(data).call
  end

  def initialize(data)
    @data = data
  end

  def call # rubocop:disable Metrics/AbcSize Metrics/MethodLength
    data[:items].each do |row|
      row[:is_folder] = folder?(row)
      row[:_children] = [] if folder?(row)
      row[:size] = human_size(row[:size])
      row[:ext] = file_ext(row)
      row[:modified] = format_time(row[:modified])
      row[:is_video] = video?(row)
      row[:is_subtitle] = subtitle?(row)
      row[:furl] = fshare_url(row)
      row[:type] = type(row)
    end

    {
      items: data[:items],
      meta: {
        current_page: extract_params_page(data[:_links][:self]),
        total_page: extract_params_page(data[:_links][:last]),
      },
    }
  end

  private

  attr_reader :data

  def extract_params_page(url)
    page_matched = /(\?|&)page=(\d+)/.match(url)
    return if page_matched.blank?

    page_matched[2].to_i
  end

  def type(row)
    return 'folder' if folder?(row)
    return 'video' if video?(row)
    return 'subtitle' if subtitle?(row)

    'file'
  end

  def human_size(size)
    return '--' if size.to_i.zero?

    number_to_human_size(size.to_i)
  end

  def file_ext(row)
    row[:name].to_s.split('.').last.to_s.upcase
  end

  def format_time(unix_time)
    return if unix_time.blank?

    Time.at(unix_time.to_i).strftime('%d/%m/%Y %H:%M:%S')
  end

  def fshare_url(row)
    type = folder?(row) ? 'folder' : 'file'

    "https://www.fshare.vn/#{type}/#{row[:linkcode]}"
  end

  def folder?(row)
    row[:mimetype].blank?
  end

  def video?(row)
    Vlc::Player::VIDEO_EXTENSIONS.include?(file_ext(row).downcase)
  end

  def subtitle?(row)
    Vlc::Player::SUBTITLE_EXTENSIONS.include?(file_ext(row).downcase)
  end
end
