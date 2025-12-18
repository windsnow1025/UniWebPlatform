FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS prod

COPY pnpm-lock.yaml /app
RUN pnpm fetch --prod

COPY package.json ./
RUN pnpm install --offline --prod

COPY . /app
RUN pnpm run build

FROM base
COPY --from=prod /app/node_modules /app/node_modules
COPY --from=prod /app/dist /app/dist
EXPOSE 3000
CMD [ "pnpm", "start:prod" ]