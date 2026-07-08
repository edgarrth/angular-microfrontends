FROM node:22-alpine AS build
WORKDIR /app
COPY backends/accounts/package*.json ./
RUN npm install
COPY backends/accounts/tsconfig.json ./tsconfig.json
COPY backends/accounts/src ./src
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV DATASET_PATH=/app/datasets/json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY datasets ./datasets
EXPOSE 3001
CMD ["node", "dist/presentation/server.js"]
