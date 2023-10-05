server: bundle exec rails server --port $RAILS_PORT --binding 0.0.0.0
worker_1: rake jobs:work
worker_2: rake jobs:work
scheduler: ruby config/scheduler.rb
