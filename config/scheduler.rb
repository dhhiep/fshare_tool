# frozen_string_literal: true

require_relative 'environment'

# Load rake tasks
FshareTool::Application.load_tasks

scheduler = Rufus::Scheduler.new

scheduler.every '15s' do
  Rake::Task['playbacks:updater'].reenable
  Rake::Task['playbacks:updater'].invoke
rescue => _e # rubocop:disable Lint/SuppressedException
end

scheduler.join
