FROM alpine:3.7

RUN apk add --update bash curl jq
COPY data/* ./data/
COPY seed-db.sh ./
CMD ["bash", "/seed-db.sh"]
