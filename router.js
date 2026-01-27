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

const PORT = process.env.PORT || 8080;
const ADMIN_PORT = 3001;
const AGENCY_PORT = 3002;
const CLIENT_PORT = 3003;

// Start admin server (standalone structure: apps/admin/server.js)
const adminServer = spawn('node', [
  path.join(__dirname, 'apps', 'admin', 'server.js')
], {
  env: { ...process.env, PORT: ADMIN_PORT, HOSTNAME: '127.0.0.1' },
  cwd: __dirname,
  stdio: 'inherit'
});

// Start agency server (standalone structure: apps/agency/server.js)
const agencyServer = spawn('node', [
  path.join(__dirname, 'apps', 'agency', 'server.js')
], {
  env: { ...process.env, PORT: AGENCY_PORT, HOSTNAME: '127.0.0.1' },
  cwd: __dirname,
  stdio: 'inherit'
});

// Start client server (standalone structure: apps/client/server.js)
const clientServer = spawn('node', [
  path.join(__dirname, 'apps', 'client', 'server.js')
], {
  env: { ...process.env, PORT: CLIENT_PORT, HOSTNAME: '127.0.0.1' },
  cwd: __dirname,
  stdio: 'inherit'
});

// Wait for servers to be ready
const waitForServer = (port, name) => {
  return new Promise((resolve) => {
    const checkServer = () => {
      const req = http.request({
        hostname: '127.0.0.1',
        port: port,
        path: '/',
        method: 'GET',
        timeout: 1000
      }, () => {
        console.log(`✓ ${name} server ready on port ${port}`);
        resolve();
      });
      
      req.on('error', () => {
        setTimeout(checkServer, 500);
      });
      
      req.on('timeout', () => {
        req.destroy();
        setTimeout(checkServer, 500);
      });
      
      req.end();
    };
    
    checkServer();
  });
};

// Wait for all servers to be ready
Promise.all([
  waitForServer(ADMIN_PORT, 'Admin'),
  waitForServer(AGENCY_PORT, 'Agency'),
  waitForServer(CLIENT_PORT, 'Client')
]).then(() => {
  console.log('All servers ready, starting router on port', PORT);
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
  
  // Route /admin/* to admin app (strip /admin prefix so app thinks it's at root)
  // Also handle /admin (without trailing slash) -> redirect to /admin/
  if (url.startsWith('/admin')) {
    // Handle exact /admin -> redirect to /admin/
    if (url === '/admin') {
      res.writeHead(301, { 'Location': '/admin/' });
      res.end();
      return;
    }
    const adminPath = url.replace(/^\/admin/, '') || '/';
    proxyRequest(req, res, ADMIN_PORT, adminPath);
  }
  // Route /agency/* to agency app (strip /agency prefix)
  else if (url.startsWith('/agency')) {
    // Handle exact /agency -> redirect to /agency/
    if (url === '/agency') {
      res.writeHead(301, { 'Location': '/agency/' });
      res.end();
      return;
    }
    const agencyPath = url.replace(/^\/agency/, '') || '/';
    proxyRequest(req, res, AGENCY_PORT, agencyPath);
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

