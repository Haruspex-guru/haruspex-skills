FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build
# Dummy key so the server starts and can answer ListTools introspection
# (e.g. Glama). The tool list is static — no real API call is made during
# introspection. A real key is required at runtime for actual tool calls.
ENV HARUSPEX_API_KEY=glama-introspection
ENTRYPOINT ["node", "dist/index.js"]
