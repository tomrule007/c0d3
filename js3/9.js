// Pokemon webpage challenge
// Generate an html file with no javascript that display pokemon's name and image
// hint: https://pokeapi.co/api/v2/pokemon/ is a free public api that contains pokemon information (names, images, ect..)

const fs = require('fs');
const https = require('https');
const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/.';

// fetch : string -> Promise
const fetch = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (data) => {
          body += data;
        });
        res.on('end', () => resolve(body));
        res.on('error', (e) => reject('RESPONSE_ERROR', e));
      })
      .on('error', (e) => reject('REQUEST_ERROR', e));
  });

// concatWithNewLine :: string -> string -> string
const concatWithNewLine = (a, b) => a + '\n' + b;

// makePokemonCard :: string -> string -> string
const makePokemonCard = (
  name,
  src
) => `<img src="${src}" alt="${name}" title="${name}" />
  <p>${name}</p>`;

// htmlPageBuilder :: string -> string -> string
const htmlPageBuilder = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    ${body}
</body>
</html>`;

// pickImageUrl :: Pokemon -> string
const pickImageUrl = (pokemon) => pokemon.sprites.front_default;

const PokemonViewBuilder = async (url) => {
  const title = 'Pokemon Viewer';
  const body = (
    await Promise.all(
      (await fetch(url).then(JSON.parse)).results.map(async ({ name, url }) => {
        const imageUrl = await fetch(url).then(JSON.parse).then(pickImageUrl);
        return makePokemonCard(name, imageUrl);
      })
    )
  ).reduce(concatWithNewLine);

  fs.writeFile('9.html', htmlPageBuilder(title, body), 'utf8', () => {
    console.log('Page Created');
  });
};

PokemonViewBuilder(POKEMON_URL);
