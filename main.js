// retrieve pokemon data from PokeAPI
const getPkmn = async (name) => {
    try {
        let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        return response.data;
    } catch (e) {
        alert(`${name} is not a valid Pokemon name. Please double check your spelling and try again.`);
    }
};

// show pokemon data
const pkmnData = (image, name, types) => {
    const html = `
                    <img src="${image}" alt="${name} image">
                    <p>Pokemon: ${name}</p>
                    <p>Type: ${(function() {
                        if (types.length > 1) {
                            return `${types[0].type.name}, ${types[1].type.name}`
                        } else {
                            return `${types[0].type.name}`
                        }
                    })()}</p>
                `;

    document.querySelector('.pkmn-data').insertAdjacentHTML('beforeend', html);
};

const form = document.querySelector('#formData');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // clear previous data
    document.querySelector('.pkmn-data').innerHTML = "";

    // get pokemon name from the form
    let pkmn = document.querySelector('#pkmn').value;

    const data = await getPkmn(pkmn.toLowerCase());
    pkmnData(data['sprites']['other']['official-artwork']['front_default'], data.name, data.types);
});