# frozen_string_literal: true

require 'net/http'

class Fshare
  include Error::ExceptionErrorBuilder

  attr_reader :token, :session_id

  def login!
    body = {
      user_email: user_email,
      password: password,
      app_key: app_key,
    }

    response = requester('/user/login', body)
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

    response = requester('/session/download', body)
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

    response = requester('/fileops/getFolderList', body)
    raise Error::GatewayError, { message: 'Get list  failure', details: response.body } if response.code != 200

    response
  end

  private

  def capture_token_and_session_id(response)
    @token = response.body['token']
    @session_id = "session_id=#{response.body['session_id']}"
  end

  def url_builder(file_id, type: 'file')
    "https://www.fshare.vn/#{type}/#{file_id}"
  end

  def requester(path, body = {})
    url = URI("#{base_url}#{path}")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true
    https.open_timeout = 5
    https.read_timeout = 5

    request = build_request(url, body)
    result = https.request(request)

    OpenStruct.new(code: result.code.to_i, body: parse_response_body(result))
  end

  def build_request(url, body = {})
    request = Net::HTTP::Post.new(url)
    request['Content-Type'] = 'application/json'
    request['User-Agent'] = user_agent
    request['Cookie'] = session_id
    request.body = JSON.dump(body)
    request
  end

  def parse_response_body(response)
    JSON.parse(response.read_body)
  rescue
    response.read_body.presence || {}
  end

  def base_url
    'https://api.fshare.vn/api'
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
