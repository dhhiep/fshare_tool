# frozen_string_literal: true

class String
  def to_md5
    Digest::MD5.hexdigest(self)
  end
end
