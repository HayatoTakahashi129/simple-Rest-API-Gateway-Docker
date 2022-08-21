FROM node:16-buster-slim

WORKDIR /code
COPY . .
RUN npm install --production
ENV PORT=30001
ENV CONFIG_PATH=configs/apiConfig.yaml
EXPOSE 30001
CMD ["npm","start"]


