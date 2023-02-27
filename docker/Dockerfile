FROM ruby:3.2.1-alpine3.17

ENV BUILD_PACKAGES bash build-base openssh git tzdata nodejs yarn sqlite-dev gcompat
ENV TZ=Asia/Ho_Chi_Minh
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN apk add --update --no-cache $BUILD_PACKAGES \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
    && rm -rf /var/cache/* && mkdir /var/cache/apk

ARG BUNDLER_VERSION
RUN gem install bundler -v $BUNDLER_VERSION

ARG WORKSPACE
WORKDIR $WORKSPACE

COPY Gemfile Gemfile.lock ./
RUN bundle config --local without development:test && bundle install --jobs 4 --retry 3 --quiet && bundle clean --force

COPY package.json yarn.lock ./
RUN yarn install

COPY ./ ./
RUN RAILS_ENV=production bundle exec rake assets:precompile

ARG RAILS_PORT
ENV RAILS_PORT=$RAILS_PORT
EXPOSE $RAILS_PORT
CMD docker/scripts/entry_point.sh
