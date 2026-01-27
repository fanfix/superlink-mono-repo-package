#!/usr/bin/env node
/**
 * Unified Router Server
 * Routes requests to admin, agency, and client Next.js apps
 * 
 * Routing:
 * - /admin/* -> Admin app (port 3001)
 * - /agency/* -> Agency app (port 3002)
 * - /* -> Client app (port 3003)
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 8080;
const ADMIN_PORT = 3001;
const AGENCY_PORT = 3002;
const CLIENT_PORT = 3003;

// Helper to start a server with error handling
const startServer = (name, serverPath, port) => {
  console.log(`Starting ${name} server at ${serverPath} on port ${port}...`);
  
  // Check if server file exists
  if (!fs.existsSync(serverPath)) {
    console.error(`ERROR: ${name} server file not found at ${serverPath}`);
    console.error(`Current working directory: ${__dirname}`);
    console.error(`Looking for: ${path.resolve(serverPath)}`);
    process.exit(1);
  }
  
  console.log(`✓ ${name} server file found`);
  
  const server = spawn('node', [serverPath], {
    env: { ...process.env, PORT: port, HOSTNAME: '127.0.0.1' },
    cwd: __dirname,
    stdio: 'inherit'
  });

  server.on('error', (err) => {
    console.error(`Failed to start ${name} server:`, err);
    process.exit(1);
  });

  server.on('exit', (code, signal) => {
    if (code !== 0 && code !== null) {
      console.error(`${name} server exited with code ${code} and signal ${signal}`);
      process.exit(1);
    }
  });

  return server;
};

// Start admin server (standalone structure: apps/admin/server.js)
const adminServerPath = path.join(__dirname, 'apps', 'admin', 'server.js');
console.log(`Admin server path: ${adminServerPath}`);
const adminServer = startServer('Admin', adminServerPath, ADMIN_PORT);

// Start agency server (standalone structure: apps/agency/server.js)
const agencyServerPath = path.join(__dirname, 'apps', 'agency', 'server.js');
console.log(`Agency server path: ${agencyServerPath}`);
const agencyServer = startServer('Agency', agencyServerPath, AGENCY_PORT);

// Start client server (standalone structure: apps/client/server.js)
const clientServerPath = path.join(__dirname, 'apps', 'client', 'server.js');
console.log(`Client server path: ${clientServerPath}`);
const clientServer = startServer('Client', clientServerPath, CLIENT_PORT);

// Wait for servers to be ready with timeout
const waitForServer = (port, name, maxAttempts = 60) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const checkServer = () => {
      attempts++;
      if (attempts > maxAttempts) {
        console.error(`Timeout waiting for ${name} server on port ${port}`);
        reject(new Error(`Timeout waiting for ${name} server`));
        return;
      }

      const req = http.request({
        hostname: '127.0.0.1',
        port: port,
        path: '/',
        method: 'GET',
        timeout: 2000
      }, () => {
        console.log(`✓ ${name} server ready on port ${port} (attempt ${attempts})`);
        resolve();
      });
      
      req.on('error', () => {
        if (attempts % 10 === 0) {
          console.log(`Waiting for ${name} server... (attempt ${attempts}/${maxAttempts})`);
        }
        setTimeout(checkServer, 1000);
      });
      
      req.on('timeout', () => {
        req.destroy();
        setTimeout(checkServer, 1000);
      });
      
      req.end();
    };
    
    checkServer();
  });
};

// Wait for all servers to be ready
Promise.all([
  waitForServer(ADMIN_PORT, 'Admin').catch(err => {
    console.error('Admin server failed to start:', err);
    process.exit(1);
  }),
  waitForServer(AGENCY_PORT, 'Agency').catch(err => {
    console.error('Agency server failed to start:', err);
    process.exit(1);
  }),
  waitForServer(CLIENT_PORT, 'Client').catch(err => {
    console.error('Client server failed to start:', err);
    process.exit(1);
  })
]).then(() => {
  console.log('All servers ready, starting router on port', PORT);
}).catch(err => {
  console.error('Failed to start all servers:', err);
  process.exit(1);
});

// Simple HTTP proxy function
const proxyRequest = (req, res, targetPort, customPath = null) => {
  const options = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: customPath !== null ? customPath : req.url,
    method: req.method,
    headers: { ...req.headers }
  };

  // Remove host header to avoid issues
  delete options.headers.host;

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error: ${err.message}`);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway');
  });

  req.pipe(proxyReq);
};

// Main router server
const server = http.createServer((req, res) => {
  const url = req.url || '/';
  
  // Route /admin/* to admin app
  // Admin app is built with basePath=/admin, so it expects /admin prefix
  // Also handle /admin (without trailing slash) -> redirect to /admin/
  if (url.startsWith('/admin')) {
    // Handle exact /admin -> redirect to /admin/
    if (url === '/admin') {
      res.writeHead(301, { 'Location': '/admin/' });
      res.end();
      return;
    }
    // Admin app expects /admin prefix, so pass the full path
    proxyRequest(req, res, ADMIN_PORT, url);
  }
  // Route /agency/* to agency app
  // Agency app is built with basePath=/agency, so it expects /agency prefix
  else if (url.startsWith('/agency')) {
    // Handle exact /agency -> redirect to /agency/
    if (url === '/agency') {
      res.writeHead(301, { 'Location': '/agency/' });
      res.end();
      return;
    }
    // Agency app expects /agency prefix, so pass the full path
    proxyRequest(req, res, AGENCY_PORT, url);
  }
  // Route everything else to client app
  else {
    proxyRequest(req, res, CLIENT_PORT);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Router server listening on port ${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
  console.log(`Agency: http://localhost:${PORT}/agency`);
  console.log(`Client: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    adminServer.kill();
    agencyServer.kill();
    clientServer.kill();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    adminServer.kill();
    agencyServer.kill();
    clientServer.kill();
    process.exit(0);
  });
});

