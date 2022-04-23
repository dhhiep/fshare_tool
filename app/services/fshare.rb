# frozen_string_literal: true

require 'net/http'

class Fshare
  include Error::ExceptionErrorBuilder

  class_attribute :token, :session_id, :token_updated

  attr_reader :token, :session_id

  def login!
    # Keep session id and token if login success in 30 minutes
    return restore_session! if self.class.token_updated.present? && self.class.token_updated >= 30.minutes.ago

    body = {
      user_email: user_email,
      password: password,
      app_key: app_key,
    }

    response = requester(:post, '/user/login', body)
    raise Error::GatewayError, { message: 'Login failure', details: response.body } if response.code != 200

    capture_token_and_session_id(response)

    response
  end

  def direct_link(file_id, options = {})
    body = {
      zipflag: 0,
      url: url_builder(file_id),
      password: options[:password] || '',
      token: token,
    }

    response = requester(:post, '/session/download', body)
    raise Error::GatewayError, { message: 'Get direct link failure', details: response.body } if response.code != 200

    response
  end

  def list(list_id, page: 1, per_page: 60)
    body = {
      token: token,
      url: url_builder(list_id, type: 'folder'),
      dirOnly: 0,
      pageIndex: page - 1,
      limit: per_page,
    }

    response = requester(:post, '/fileops/getFolderList', body)
    raise Error::GatewayError, { message: 'Get list  failure', details: response.body } if response.code != 200

    response
  end

  def list_v3(list_id, page: 1, per_page: 50, options: {})
    url = 'https://www.fshare.vn/api/v3/files/folder'
    body = {
      linkcode: list_id,
      url: url_builder(list_id, type: 'folder'),
      sort: options[:sort_by] || 'type,name',
      page: page,
      'per-page': per_page
    }

    Http::Requester.make_request(:get, url, body, { timeout: 5 })
  end

  private

  def capture_token_and_session_id(response)
    @token = response.body[:token]
    @session_id = "session_id=#{response.body[:session_id]}"

    cache_latest_session!
  end

  def cache_latest_session!
    self.class.token = token
    self.class.token_updated = Time.current
    self.class.session_id = session_id
  end

  def restore_session!
    @token = self.class.token
    @session_id = self.class.session_id
  end

  def url_builder(file_id, type: 'file')
    "https://www.fshare.vn/#{type}/#{file_id}"
  end

  def requester(http_verb, path, body = {}, options = {})
    Http::Requester.make_request(http_verb, url(path), body, default_options.merge(options))
  end

  def url(path)
    "https://api.fshare.vn/api#{path}"
  end

  def default_options
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': user_agent,
        Cookie: session_id,
      },
      timeout: 5,
    }
  end

  def user_email
    ENV.fetch('FSHARE_USER_EMAIL')
  end

  def password
    ENV.fetch('FSHARE_PASSWORD')
  end

  def app_key
    ENV.fetch('FSHARE_APP_KEY')
  end

  def user_agent
    ENV.fetch('FSHARE_USER_AGENT')
  end
end
