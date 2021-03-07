(() => {
  const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/.';

  // State
  let next = null;
  let previous = null;
  let loading = true;

  // DOM Node Refs
  const main = document.querySelector('.main');
  const previousButton = document.querySelector('#previousButton');
  const nextButton = document.querySelector('#nextButton');

  // Event Listeners
  previousButton.addEventListener('click', () => {
    if (previous && !loading) renderPokemonPage(previous);
  });
  nextButton.addEventListener('click', () => {
    if (next && !loading) renderPokemonPage(next);
  });

  // App

  // concatWithNewLine :: string -> string -> string
  const concatWithNewLine = (a, b) => a + '\n' + b;

  // makePokemonCard :: string -> string -> string
  const makePokemonCard = (name, src) => `
<div class="pokeContainer">
    <h1 class="pokeName">${name}</h1>
    <div class="pokeContainerImage">
        <img src="${src}" alt="${name}" title="${name}" />
    </div>
</div>`;

  // pickImageUrl :: Pokemon -> string
  const pickImageUrl = (pokemon) => pokemon.sprites.front_default;

  async function renderPokemonPage(url) {
    loading = true; // Set loading lock to prevent double fetching

    const pokemonPage = await fetch(url).then((response) => response.json());

    const pokemonCards = (
      await Promise.all(
        pokemonPage.results.map(async ({ name, url }) => {
          const pokemon = await fetch(url).then((response) =>
            response.ok ? response.json() : null
          );

          return pokemon ? makePokemonCard(name, pickImageUrl(pokemon)) : '';
        })
      )
    )
      .filter((a) => a !== '') // Remove failed pokemon fetches
      .reduce(concatWithNewLine);

    main.innerHTML = pokemonCards;

    // update State
    next = pokemonPage.next;
    previous = pokemonPage.previous;
    loading = false;
  }

  renderPokemonPage(POKEMON_URL);
})();
