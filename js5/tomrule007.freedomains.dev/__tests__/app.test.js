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

  it('should cache image and only make one fetch', async () => {
    // Module used by Jimp to fetch image
    jest.mock('phin', () => jest.fn(jest.requireActual('phin')));
    const p = require('phin');

    const imageSrc = `http://localhost:${port}/js5-p3-test-dont-delete.jpeg`;

    // First call
    await fetch(`http://localhost:${port}/memegen/api/test?src=${imageSrc}`);
    // Second call
    await fetch(`http://localhost:${port}/memegen/api/test?src=${imageSrc}`);

    expect(p).toHaveBeenCalledWith(
      { compression: true, url: imageSrc },
      expect.anything()
    );

    expect(p).toHaveBeenCalledTimes(1);
  });

  describe('Handles invalid requests with detailed error msgs', () => {
    it.each`
      input                 | expected
      ${'?no=wrong'}        | ${{ error: 'Must include text as last value in path' }}
      ${'text?no=wrong'}    | ${{ error: 'Invalid parameters: no' }}
      ${'text?blur=wrong'}  | ${{ error: 'Invalid parameter value: blur expects type Number' }}
      ${'text?black=wrong'} | ${{ error: 'Invalid parameter value: black expects true|false' }}
    `('$input --> $expected', async ({ input, expected }) => {
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
