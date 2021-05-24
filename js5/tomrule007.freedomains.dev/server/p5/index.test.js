const http = require('http');
const app = require('../app');
const fetch = require('node-fetch');
const { startServer, stopServer } = require('../utilities');
const fs = require('fs').promises;

describe('js5/p5', () => {
  let server;
  let port;

  beforeAll(async (done) => {
    try {
      [server, port] = await startServer(app);
    } catch (error) {
      console.error('Server Starting Error', error);
    }
    done();
  });

  afterAll(() => stopServer(server, port));
  it('server starts', () => {
    expect(server instanceof http.Server).toBe(true);
  });
  it('port is set', () => {
    expect(typeof port).toBe('number');
  });

  // END POINT TESTS
  describe('GET /api/session', async () => {});

  describe('POST /api/:room/messages', async () => {
    const post = (data) =>
      fetch(`http://localhost:${port}/api/${room}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  });

  describe('GET /api/:room/messages', async () => {
    const get = (room) =>
      fetch(`http://localhost:${port}/api/${room}/messages`);
  });

  const response = await get('tomsRoom');
});
