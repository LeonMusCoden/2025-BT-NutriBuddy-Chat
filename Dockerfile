# Build stage
FROM node:23-alpine AS build
WORKDIR /app

# Define build arguments
ARG NODE_ENV
ARG VITE_API_URL
ARG VITE_ASSISTANT_ID
ARG VITE_LANGSMITH_API_KEY

# Set environment variables from build arguments
ENV NODE_ENV=$NODE_ENV
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ASSISTANT_ID=$VITE_ASSISTANT_ID
ENV VITE_LANGSMITH_API_KEY=$VITE_LANGSMITH_API_KEY

# Copy package dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Copy built assets from build stage
COPY --from=build /app/dist ./

# Copy custom nginx config if needed
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
