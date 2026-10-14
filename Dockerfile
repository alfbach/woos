FROM nginx:1.27-alpine

# OpenShift: arbitrary UID in group 0; non-root port
RUN sed -i 's/user  nginx;/# user nginx;/' /etc/nginx/nginx.conf \
 && sed -i 's,/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf \
 && sed -i 's,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf \
 && mkdir -p /var/cache/nginx /tmp/nginx \
 && chgrp -R 0 /var/cache/nginx /var/log/nginx /usr/share/nginx/html /etc/nginx /tmp \
 && chmod -R g+rwX /var/cache/nginx /var/log/nginx /usr/share/nginx/html /etc/nginx /tmp

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html styles.css game.js /usr/share/nginx/html/

EXPOSE 8080

USER 1001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
