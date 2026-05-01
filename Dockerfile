FROM nginx:latest

RUN apt update && apt install -y nodejs npm supervisor

COPY default.conf /etc/nginx/conf.d/default.conf
COPY static /home/html
COPY source/main.js /home/main.js

COPY database.db /home/database.db
COPY package.json /home/package.json
RUN cd /home && npm install

COPY .env /home/.env
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /home

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]