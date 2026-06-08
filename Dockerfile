FROM node:20-alpine
WORKDIR /app
# The MCP server source lives in mcp-server/. This root Dockerfile exists so
# crawlers that build from the repo root (e.g. Glama) can find it; the
# canonical copy is mcp-server/Dockerfile.
COPY mcp-server/package.json mcp-server/tsconfig.json ./
RUN npm install
COPY mcp-server/src ./src
RUN npm run build
# Dummy key so the server starts and can answer ListTools introspection.
# The tool list is static — no real API call is made during introspection.
# A real key is required at runtime for actual tool calls.
ENV HARUSPEX_API_KEY=glama-introspection
ENTRYPOINT ["node", "dist/index.js"]
