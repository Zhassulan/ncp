FROM docker.tele2.kz/other_team/ncp/angular-cli:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN ng build --base-href "/ncp-frontend/" --configuration=production 


FROM docker.tele2.kz/ext-images/nginx:1.21.3 AS nginx
LABEL maintainer="SoftwareDevelopment_KZ@TELE2.kz"
LABEL name="NGINX dev"
LABEL description="NGINX NCP-UI"
ARG ENV
ARG PROJECT
ENV TZ Asia/Almaty
ENV DEBIAN_FRONTEND noninteractive
COPY ./src/utils/${ENV}/nginx /etc/logrotate.d/nginx
COPY ./src/utils/${ENV}/entrypoint.sh /entrypoint.sh
COPY ./src/utils/${ENV}/nginx.conf /etc/nginx/nginx.conf

USER root
RUN rm /etc/nginx/conf.d/default.conf \
  && chmod -R 777 /var/log/nginx /var/cache/nginx/ /var/run/ \
  && rm -f /usr/share/nginx/html/* \
  && chmod -R 644 /etc/nginx/*

COPY --from=build /app/dist/browser /usr/share/nginx/html/ncp-frontend/
RUN chmod -R 755 /usr/share/nginx/html \
    && chown -R root:root /usr/share/nginx/html
