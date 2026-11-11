process.env.CI = 'true';
const { createServer } = require('vite');

async function start() {
  try {
    const server = await createServer({
      configFile: './vite.config.ts',
      server: {
        port: 3000,
        host: '0.0.0.0'
      }
    });
    await server.listen();
    server.printUrls();
    console.log('Vite server successfully running on port 3000');
    
    // Prevent process exit
    setInterval(() => {}, 1 << 30);
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

start();

