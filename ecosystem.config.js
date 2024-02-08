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
        DBHOST: 'yesappcenterdb.mysql.database.azure.com',
        DBPORT: 3306,
        DBUSER: 'yesdbadmin',
        DBPASS: 'qBABt797iNHu9Zx',
        DBNAME: 'dbappnovaventa',
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
        DBHOST: 'yesappcenterdb.mysql.database.azure.com',
        DBPORT: 3306,
        DBUSER: 'yesdbadmin',
        DBPASS: 'qBABt797iNHu9Zx',
        DBNAME: 'dbappnovaventa',
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
        DBHOST: 'yesappcenterdb.mysql.database.azure.com',
        DBPORT: 3306,
        DBUSER: 'yesdbadmin',
        DBPASS: 'qBABt797iNHu9Zx',
        DBNAME: 'dbappnovaventa',
        PORTSERVER: 3013,
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
        DBHOST: 'yesappcenterdb.mysql.database.azure.com',
        DBPORT: 3306,
        DBUSER: 'yesdbadmin',
        DBPASS: 'qBABt797iNHu9Zx',
        DBNAME: 'dbappnovaventa',
        PORTSERVER: 8013,
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
        DBHOST: 'yesappcenterdb.mysql.database.azure.com',
        DBPORT: 3306,
        DBUSER: 'yesdbadmin',
        DBPASS: 'qBABt797iNHu9Zx',
        DBNAME: 'dbappnovaventa',
        PORTSERVER: 3050,
        DB_ROUTE: '/socket.io'
      }
    },
  ],
};
