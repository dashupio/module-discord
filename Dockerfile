# use node
FROM node:alpine

# Create app directory
WORKDIR /usr/src/module

# Copy directory
COPY . /usr/src/module
RUN rm -rf .cache

# Install dependencies
RUN npm i

# CMD
CMD ["node", "index"]