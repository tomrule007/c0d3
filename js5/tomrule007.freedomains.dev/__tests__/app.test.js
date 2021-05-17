var http = require('http');
const { app } = require('../app');
const fetch = require('node-fetch');
const { startServer, stopServer } = require('../utilities');

describe('js5/p3 (/memegen/api...)', () => {
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
  xit('Matches snapshot test', async () => {});

  describe('Handles invalid params with json error msg and status 400', () => {
    it.each`
      input                 | expected
      ${'text?no=wrong'}    | ${{ error: 'invalid parameter: no' }}
      ${'text?blur=wrong'}  | ${{ error: 'invalid parameter value: blur expects type Number' }}
      ${'text?black=wrong'} | ${{ error: 'invalid parameter value: black expects type Bool' }}
      ${'text?src=wrong'}   | ${{ error: 'invalid parameter value: src expects valid URL string' }}
    `('$input --> $expected', async (input, expected) => {
      const response = await fetch(
        `http://localhost:${port}/memegen/api/${input}`
      );
      const content =
        response.status === 400 ? await response.json() : await response.text();

      expect(content).toEqual(expected);
      expect(response.status).toBe(400);
    });
  });
});

xdescribe('js5/p2', () => {
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
  describe('GET /commands', () => {
    let response;
    beforeAll(async () =>
      fetch(`http://localhost:${port}/commands`).then((res) => {
        response = res;
      })
    );
    it('serves html page without errors', () => {
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type').toLowerCase()).toBe(
        'text/html; charset=utf-8'
      );
    });
  });
  describe('POST /commands', () => {
    const fetchPostCommands = (data) =>
      fetch(`http://localhost:${port}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    it('Status 200', async () => {
      const response = await fetchPostCommands({ stdin: 'ls test' });
      expect(response.status).toBe(200);
    });
    it("Content-Type json'", async () => {
      const response = await fetchPostCommands({ stdin: 'ls test' });
      expect(response.headers.get('content-type')).toBe(
        'application/json; charset=utf-8'
      );
    });
    it('Responses shape   --->   { stdin, stdout, stderr, exitCode}', async () => {
      const response = await fetchPostCommands({ stdin: 'ls' });
      const content = await response.json();
      expect(Object.keys(content)).toEqual([
        'stdout',
        'stderr',
        'exitCode',
        'stdin',
      ]);
    });
    it('responds to invalid command', async () => {
      const input = { stdin: 'tommy test' };
      const response = await fetchPostCommands(input);

      const content = response.ok
        ? await response.json()
        : await response.text();

      expect(content).toEqual({
        ...input,
        stdout: 'bash: tommy: command not found',
        stderr: null,
        exitCode: 1,
      });
    });

    it('ls ./__tests__   --->   app.test.js\\ntest.txt\\n', async () => {
      const input = { stdin: 'ls ./__tests__' };
      const response = await fetchPostCommands(input);

      const content = response.ok
        ? await response.json()
        : await response.text();

      expect(content).toEqual({
        ...input,
        stdout: 'app.test.js\ntest.txt\n',
        stderr: null,
        exitCode: 0,
      });
    });

    it('cat ./__tests__/test.txt   --->   "cat test"', async () => {
      const input = {
        stdin: 'cat ./__tests__/test.txt',
      };
      const response = await fetchPostCommands(input);

      const content = response.ok
        ? await response.json()
        : await response.text();

      expect(content).toEqual({
        ...input,
        stdout: 'cat test',
        stderr: null,
        exitCode: 0,
      });
    });
  });
});
