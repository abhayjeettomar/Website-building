const http = require('http');

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  });

  req.pipe(proxy, { end: true });
});

server.listen(5173, '0.0.0.0', () => {
  console.log('Proxy listening on port 5173 -> forwarding to 3000');
});

