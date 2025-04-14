module.exports = {
  apps: [
    {
      name: 'dental-site',
      script: 'dental-site/server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: ['dental-site'],
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G'
    },
    {
      name: 'admin-web',
      script: 'admin-web/server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      watch: ['admin-web'],
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G'
    },
    {
      name: 'appointment-backend',
      script: 'appointment-backend/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      watch: ['appointment-backend'],
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G'
    },
    {
      name: 'dental-backend',
      script: 'dental-backend/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      watch: ['dental-backend'],
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G'
    }
  ]
}
