#! /bin/sh
set -e

RAILS_ENV=production bundle exec rake db:migrate

exec "$@"
