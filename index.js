const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const CACHE_DIR = path.join(__dirname, 'cache');

// Створення каталогу кешу, якщо його немає
fs.mkdir(CACHE_DIR, { recursive: true })
  .then(() => {
    const server = http.createServer(async (req, res) => {
      const code = req.url.substring(1); // отримати код з URL
      const filePath = path.join(CACHE_DIR, `${code}.jpg`);

      if (req.method === 'GET') {
        try {
          const data = await fs.readFile(filePath);
          res.writeHead(200, { 'Content-Type': 'image/jpeg' });
          res.end(data);
        } catch (error) {
          if (error.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          }
        }
      } else if (req.method === 'PUT') {
        let body = [];
        req.on('data', chunk => {
          body.push(chunk);
        }).on('end', async () => {
          try {
            const imageBuffer = Buffer.concat(body);
            await fs.writeFile(filePath, imageBuffer);
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Created');
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          }
        });
      } else if (req.method === 'DELETE') {
        try {
          await fs.unlink(filePath);
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Deleted');
        } catch (error) {
          if (error.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          }
        }
      } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
      }
    });

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error creating cache directory:', err);
  });
