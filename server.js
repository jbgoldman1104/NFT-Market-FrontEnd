/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:3000`);
  });
});
