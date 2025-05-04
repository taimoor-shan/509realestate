FROM node:18-slim AS builder

RUN mkdir /app
# NodeJS app lives here
WORKDIR /app

# Install packages needed to build node modules
RUN apt update -qq && \
    apt install -y python-is-python3 pkg-config build-essential

# Install node modules
COPY package.json package-lock.json ./
RUN npm install dotenv
RUN npm ci

# copy source across (excludes items filtered by .dockerignore)
COPY . .

# Build the application
RUN npm run build

FROM node:18-slim AS runner

# Install PostgreSQL client for database migrations
RUN apt update -qq && \
    apt install -y postgresql-client

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app
COPY --from=builder /app/scripts /app/scripts
COPY --from=builder /app/sql /app/sql
WORKDIR /app
ENV NODE_ENV production

# Start the server by default, this can be overwritten at runtime
CMD [ "node", "build" ]
