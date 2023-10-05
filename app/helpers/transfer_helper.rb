# frozen_string_literal: true

module TransferHelper
  def display_transfer_status(status)
    html_class, text =
      case status.to_sym
      when :finished
        %w[bg-purple Finished]
      when :queued
        %w[bg-indigo Queued]
      when :stopped
        %w[bg-orange Stopped]
      when :processing
        %w[bg-teal Processing]
      else
        %w[bg-red Unknown]
      end

    <<-HTML
      <span class="badge #{html_class}">#{text}</span>
    HTML
  end
end
