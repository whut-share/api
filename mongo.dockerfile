FROM mongo:4.4
RUN echo "rs.initiate({ _id: 'dungeon', members: [ { '_id': 0, 'host': 'database:27017' } ] });" > /docker-entrypoint-initdb.d/replica-init.js
CMD ["--replSet", "dungeon", "--bind_ip_all"]