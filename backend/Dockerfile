FROM node:18


RUN apt-get update && apt-get install -y openssl


WORKDIR /usr/src/app


# Copy package.json and tsconfig.json first for caching purposes
COPY package.json tsconfig.json ./


COPY . .


RUN mkdir -p ./db && echo 'DATABASE_URL="postgresql://postgres.smogecmkfjrcainhylxq:Lakra%40123007@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"\nDIRECT_URL="postgresql://postgres.smogecmkfjrcainhylxq:Lakra%40123007@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"' > ./db/.env


# Copy the rest of the application code

# Install dependencies
RUN npm install

# # Install esbuild globally
RUN npm install -g esbuild

# Install Prisma globally
RUN npm install -g prisma


# Can you add a script to the global package.json that does this?
RUN npm run db:generate


RUN npm install


COPY . .


EXPOSE 4000


CMD ["npm", "start"] 

