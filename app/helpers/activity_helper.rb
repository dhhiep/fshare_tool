# frozen_string_literal: true

module ActivityHelper
  def display_activity_action(action)
    html_class, text =
      case action.to_sym
      when :play
        %w[bg-teal Play]
      when :direct_link
        %w[bg-orange Link]
      when :list, :list_v3
        %w[bg-purple List]
      else
        %w[bg-red Unknown]
      end

    <<-HTML
      <span class="badge #{html_class}">#{text}</span>
    HTML
  end

  def display_activity_file_ext(activity)
    html_class, text =
      case activity.file_type.to_sym
      when :video
        ['bg-teal', activity.file_ext]
      when :file
        ['bg-orange', activity.file_ext]
      when :folder
        ['bg-purple', 'N/A']
      else
        ['bg-red', activity.file_ext]
      end

    <<-HTML
      <span class="badge #{html_class}">#{text}</span>
    HTML
  end
end
