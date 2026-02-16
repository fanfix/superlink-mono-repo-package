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

// Each app runs from its own directory (run-*) so it uses its own node_modules
const RUN_ADMIN = path.join(__dirname, 'run-admin');
const RUN_AGENCY = path.join(__dirname, 'run-agency');
const RUN_CLIENT = path.join(__dirname, 'run-client');

// Helper to start a server with error handling (cwd = app dir so node_modules resolve)
const startServer = (name, serverPath, port, cwd) => {
  console.log(`Starting ${name} server at ${serverPath} on port ${port} (cwd: ${cwd})...`);

  if (!fs.existsSync(serverPath)) {
    console.error(`ERROR: ${name} server file not found at ${serverPath}`);
    console.error(`Current working directory: ${__dirname}`);
    process.exit(1);
  }
  console.log(`✓ ${name} server file found`);

  const basePathEnv = name === 'Admin' ? '/admin' : name === 'Agency' ? '/agency' : '';
  const serverEnv = {
    ...process.env,
    PORT: String(port),
    HOSTNAME: '127.0.0.1',
    NEXT_PUBLIC_BASE_PATH: basePathEnv
  };

  const server = spawn('node', [serverPath], {
    env: serverEnv,
    cwd: cwd || __dirname,
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

// Start each app from its run-* directory (own node_modules)
const adminServerPath = path.join(RUN_ADMIN, 'apps', 'admin', 'server.js');
const agencyServerPath = path.join(RUN_AGENCY, 'apps', 'agency', 'server.js');
const clientServerPath = path.join(RUN_CLIENT, 'apps', 'client', 'server.js');

console.log(`Admin server: ${adminServerPath}`);
const adminServer = startServer('Admin', adminServerPath, ADMIN_PORT, RUN_ADMIN);

console.log(`Agency server: ${agencyServerPath}`);
const agencyServer = startServer('Agency', agencyServerPath, AGENCY_PORT, RUN_AGENCY);

console.log(`Client server: ${clientServerPath} (handles root /)`);
const clientServer = startServer('Client', clientServerPath, CLIENT_PORT, RUN_CLIENT);

// Wait for servers to be ready with timeout
const waitForServer = (port, name, maxAttempts = 60) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const checkServer = () => {
      attempts++;
      if (attempts > maxAttempts) {
        console.error(`❌ Timeout waiting for ${name} server on port ${port}`);
        if (name === 'Client') {
          console.error(`❌ CRITICAL: Client server timeout - root path (/) will not work!`);
        }
        reject(new Error(`Timeout waiting for ${name} server`));
        return;
      }

      const req = http.request({
        hostname: '127.0.0.1',
        port: port,
        path: '/',
        method: 'GET',
        timeout: 2000
      }, (res) => {
        console.log(`✓ ${name} server ready on port ${port} (attempt ${attempts}, status: ${res.statusCode})`);
        resolve();
      });
      
      req.on('error', (err) => {
        if (attempts % 10 === 0) {
          console.log(`⏳ Waiting for ${name} server... (attempt ${attempts}/${maxAttempts})`);
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

// Parse pathname and query from req.url (pathname has no query string)
const getPathnameAndQuery = (url) => {
  const u = url || '/';
  const i = u.indexOf('?');
  return i === -1 ? [u, ''] : [u.slice(0, i), u.slice(i)];
};

// Main router server - create it but don't start listening yet
const server = http.createServer((req, res) => {
  const url = req.url || '/';
  const [pathname, query] = getPathnameAndQuery(url);
  const queryStr = query ? (query.startsWith('?') ? query : '?' + query) : '';

  console.log(`[Router] Incoming request: ${req.method} ${url}`);

  // Route /admin/* to admin app
  // Admin app is built with basePath=/admin, so it expects /admin prefix
  // Also handle /admin (without trailing slash) -> redirect to /admin/
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    console.log(`[Router] Routing to Admin app (port ${ADMIN_PORT}): ${url}`);
    if (pathname === '/admin') {
      res.writeHead(301, { 'Location': '/admin/' + queryStr });
      res.end();
      return;
    }
    proxyRequest(req, res, ADMIN_PORT, url);
  }
  // Route /agency/* to agency app (full agency app runs at /agency)
  // Agency app is built with basePath=/agency, so it expects /agency prefix
  else if (pathname === '/agency' || pathname.startsWith('/agency/')) {
    console.log(`[Router] Routing to Agency app (port ${AGENCY_PORT}): ${url}`);
    if (pathname === '/agency') {
      res.writeHead(301, { 'Location': '/agency/' + queryStr });
      res.end();
      return;
    }
    proxyRequest(req, res, AGENCY_PORT, url);
  }
  // Route everything else (including root /) to client app
  // IMPORTANT: This must be the default route for root path
  else {
    console.log(`[Router] Routing to Client app (port ${CLIENT_PORT}): ${url}`);
    // Explicitly handle root path to ensure it goes to client
    if (url === '/' || url === '') {
      console.log(`[Router] Root path detected, routing to Client app`);
    }
    proxyRequest(req, res, CLIENT_PORT, url);
  }
});

// Wait for all servers to be ready before starting the router
// IMPORTANT: Client server must start successfully for root path to work
Promise.all([
  waitForServer(ADMIN_PORT, 'Admin').catch(err => {
    console.error('❌ Admin server failed to start:', err);
    process.exit(1);
  }),
  waitForServer(AGENCY_PORT, 'Agency').catch(err => {
    console.error('❌ Agency server failed to start:', err);
    process.exit(1);
  }),
  waitForServer(CLIENT_PORT, 'Client').catch(err => {
    console.error('❌ Client server failed to start:', err);
    console.error('❌ CRITICAL: Client server must be running for root path (/) to work');
    process.exit(1);
  })
]).then(() => {
  console.log('✅ All servers ready, starting router on port', PORT);
  console.log('✅ Admin: http://localhost:' + PORT + '/admin');
  console.log('✅ Agency: http://localhost:' + PORT + '/agency');
  console.log('✅ Client: http://localhost:' + PORT + '/ (ROOT PATH)');
  // Only start listening after all servers are ready
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Router server listening on port ${PORT}`);
    console.log(`📍 Root path (/) routes to Client app on port ${CLIENT_PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to start all servers:', err);
  process.exit(1);
});

// Simple HTTP proxy function
const proxyRequest = (req, res, targetPort, customPath = null) => {
  const targetPath = customPath !== null ? customPath : req.url;
  const options = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: targetPath,
    method: req.method,
    headers: { ...req.headers }
  };

  // Remove host header to avoid issues
  delete options.headers.host;

  console.log(`[Router] Proxying ${req.method} ${targetPath} to port ${targetPort}`);

  const proxyReq = http.request(options, (proxyRes) => {
    console.log(`[Router] Response from port ${targetPort}: ${proxyRes.statusCode} for ${targetPath}`);
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(`[Router] ❌ Proxy error for port ${targetPort}: ${err.message}`);
    console.error(`[Router] ❌ Failed to proxy ${req.method} ${targetPath} to port ${targetPort}`);
    
    // If client server fails, this is critical
    if (targetPort === CLIENT_PORT) {
      console.error(`[Router] ❌ CRITICAL: Client server (port ${CLIENT_PORT}) is not responding!`);
      console.error(`[Router] ❌ Root path (/) requires Client server to be running`);
    }
    
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Bad Gateway: Failed to connect to app on port ${targetPort}. Check server logs.`);
  });

  req.pipe(proxyReq);
};


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

