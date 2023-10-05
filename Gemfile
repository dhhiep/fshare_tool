# frozen_string_literal: true

source 'https://rubygems.org'

git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.2.1'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails', branch: 'main'
gem 'rails', '~> 6.1.4'

# Use sqlite3 as the database for Active Record
gem 'sqlite3', '~> 1.4', platforms: %i[mingw mswin x64_mingw ruby]

# Use Puma as the app server
gem 'puma', '~> 5.0'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.7'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'

# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.4', require: false

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
gem 'rack-cors', '~> 1.1'

# Streaming downloads using net/http, http.rb or wget
gem 'down', '~> 5.0'

# Makes http request
gem 'httparty', '~> 0.18'

# Object-based searching.
gem 'ransack', '~> 2.4'

# HTML Abstraction Markup Language - A Markup Haiku
gem 'haml', '~> 5.2'

# Paginator for Rails
gem 'kaminari', '~> 0.17'

# Provides telnet client functionality.
gem 'net-telnet', github: 'dhhiep/net-telnet'

# scheduler for Ruby (at, in, cron and every jobs)
gem 'rufus-scheduler', '~> 3.8'

# Manage Procfile-based applications
gem 'foreman', '~> 0.87'

# Retryable is general-purpose retrying library, written in Ruby, to simplify the task of adding retry behavior to just about anything.
gem 'retryable', '~> 3.0'

# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 5.2'

# Database based asynchronous priority queue system -- Extracted from Shopify
gem 'delayed_job_active_record'
gem 'delayed_job_web'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]

  # A runtime developer console and IRB alternative with powerful introspection capabilities.
  gem 'pry'

  # A Ruby gem to load environment variables from `.env`.
  gem 'dotenv-rails', '~> 2.7'
end

group :development do
  gem 'listen', '~> 3.3'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
