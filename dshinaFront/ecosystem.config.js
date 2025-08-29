module.exports = {
  apps: [
    {
      name: 'dshina',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/dshina/current', // Путь к проекту на сервере
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/dshina-error.log',
      out_file: '/var/log/pm2/dshina-out.log',
      log_file: '/var/log/pm2/dshina-combined.log',
      time: true
    }
  ],

  deploy: {
    production: {
      user: 'your-server-user',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/your-repo.git',
      path: '/var/www/dshina',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};