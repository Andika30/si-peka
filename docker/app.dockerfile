FROM node:20-alpine

WORKDIR /srv/peka

EXPOSE 3000

# ponytail: source di-mount lewat volume (lihat docker-compose.yml), jadi image
# ini cuma runtime kosong. install+build jalan tiap start container - upgrade ke
# multi-stage build (COPY source, bake node_modules/.next di image) kalau start
# time atau reproducibility mulai jadi masalah.
CMD ["sh", "-c", "npm install && npm run build && npm run start"]
