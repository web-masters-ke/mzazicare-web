#!/bin/sh
set -e

# Runtime injection of NEXT_PUBLIC_* environment variables
# These were baked as placeholders at build time and get replaced here
if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  find /app/.next -name '*.js' -exec sed -i "s|NEXT_PUBLIC_API_URL_PLACEHOLDER|${NEXT_PUBLIC_API_URL}|g" {} +
fi

exec node server.js
