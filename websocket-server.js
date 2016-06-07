const http = require('http');
const PouchDB = require('pouchdb');
const PouchSync = require('pouch-websocket-sync');

const server = http.createServer();
const wss = PouchSync.createServer(server, onRequest);

wss.on('error', function(err) {
  console.error(err.stack);
});

const db = new PouchDB('docs');

server.listen(3001, function() {
  console.log((new Date()) + ' Server is listening on', server.address());
});

function onRequest(credentials, dbName, callback) {
  if (dbName == 'docs') {
    callback(null, db);
  } else {
    callback(new Error('database not allowed'));
  }
}
