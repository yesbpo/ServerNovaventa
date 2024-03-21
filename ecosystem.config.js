module.exports = {
  apps: [
    {
      name: 'api',
      script: 'api.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        DBHOST: '172.19.176.1',
        DBPORT: 3306,
        DBUSER: 'root',
        DBPASS: 'contraseña123',
        DBNAME: 'baseprueba1',
        PORTSERVER: 3040,
        DB_ROUTE: '/sa'
      }
    },
    {
      name: 'get',
      script: 'get.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        DBHOST: '172.19.176.1',
        DBPORT: 3306,
        DBUSER: 'root',
        DBPASS: 'contraseña123',
        DBNAME: 'baseprueba1',
        PORTSERVER: 8080,
        DB_ROUTE: '/w'
      }
    },
    {
      name: 'server',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        DBHOST: '172.19.176.1',
        DBPORT: 3306,
        DBUSER: 'root',
        DBPASS: 'contraseña123',
        DBNAME: 'baseprueba1',
        PORTSERVER: 3001,
        DB_ROUTE: '/dbn'

      }
    },
    {
      name: 'serverdos',
      script: 'serverdos.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        DBHOST: '172.19.176.1',
        DBPORT: 3306,
        DBUSER: 'root',
        DBPASS: 'contraseña123',
        DBNAME: 'baseprueba1',
        PORTSERVER: 8001,
        DB_ROUTE: '/dbn2'
      }
    },
    {
      name: 'serversocket',
      script: 'serversocket.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        DBHOST: 'localhost',
        DBPORT: 3306,
        DBUSER: 'root',
        DBPASS: 'contraseña123',
        DBNAME: 'baseprueba1',
        PORTSERVER: 3050,
        DB_ROUTE: '/socket.io'
      }
    },
  ],
};
