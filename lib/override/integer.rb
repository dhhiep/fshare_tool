# frozen_string_literal: true

class Integer
  def display_in_hours
    Time.at(seconds).gmtime.strftime('%R:%S')
  end
end
