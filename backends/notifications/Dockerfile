FROM node:22-alpine AS build
WORKDIR /app
COPY backends/notifications/package*.json ./
RUN npm install
COPY backends/notifications/tsconfig.json ./tsconfig.json
COPY backends/notifications/src ./src
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3003
ENV DATASET_PATH=/app/datasets/json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY datasets ./datasets
EXPOSE 3003
CMD ["node", "dist/presentation/server.js"]
