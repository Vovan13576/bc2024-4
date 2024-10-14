const http = require('http');
const fs = require('fs').promises;
const commander = require('commander');
const path = require('path');

const program = new commander.Command();

program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Cache directory')
  .parse(process.argv);

const { host, port, cache } = program.opts();

const server = http.createServer(async (req, res) => {
  // Тут буде логіка обробки запитів
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
