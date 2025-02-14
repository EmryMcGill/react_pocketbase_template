FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app's source code and build the production-ready files
COPY . ./

ARG VITE_PB_URI
ENV VITE_PB_URI=$VITE_PB_URI

RUN npm run build

# Use an Nginx image to serve the built app
FROM nginx:alpine

# Copy the built files to the Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf  /etc/nginx/conf.d

# Expose port 4000
EXPOSE 4000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
