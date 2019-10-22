const http = require('http');
const request = require('request');
require('dotenv').config();

const clientId = process.env.REACT_APP_CLIENT_ID;
const secretKey = process.env.REACT_APP_SECRET_KEY;

http.createServer((req, res) => {
  console.log('test', req, res)
  var code = req.url.split("=")[1];
  if (code) {
    request.post('https://github.com/login/oauth/access_token', {
      form: {
        code: code,
        client_id: clientId,
        client_secret: secretKey,
      }
    }, (err, r, body) => {
      res.writeHead(301, {
        'Location': 'https://cs-github.netlify.com/?' + body
      });
      res.end();
    })
    
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(5000);