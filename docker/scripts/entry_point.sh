#! /bin/sh

./docker/scripts/remove_pid.sh
./docker/scripts/migrate.sh

RAILS_SERVE_STATIC_FILES=1 RAILS_ENV=production foreman start
