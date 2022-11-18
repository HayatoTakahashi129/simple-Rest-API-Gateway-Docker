FROM node:16-buster-slim

WORKDIR /code
COPY . .
RUN npm install && \
npm run build && \
ls | egrep -v '^dist$' | xargs rm -r
ENV PORT=30001
ENV CONFIG_PATH=configs/apiConfig.yaml
EXPOSE 30001
CMD ["node","/code/dist/bundle.js"]


