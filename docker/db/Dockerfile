FROM alpine:3.7

RUN apk add --update bash curl
COPY seed-db.sh /
CMD ["bash", "/seed-db.sh"]
