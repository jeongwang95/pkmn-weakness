// retrieve pokemon data from PokeAPI
const getPkmn = async (name) => {
    try {
        let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        return response.data;
    } catch (e) {
        alert(`${name} is not a valid Pokemon name. Please double check your spelling and try again.`);
    }
};

// retrieve type damage relations from PokeAPI
const getDmg = async (type) => {
    try {
        let response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
        let data = response.data;
        return data.damage_relations;
    } catch (e) {
        console.log(e);
    }
}

// Gather damage relations for each type then combine it as a string
const dmgRelations = async (types) => {
    let s = `${types[0].type.name}:<br>`;
    const dmgData = await getDmg(types[0].type.name);
    for (const k in dmgData) {
        if (k == 'double_damage_from' || k == 'half_damage_from' || k == 'no_damage_from') {
            s += `${k}: `;
            dmgData[k].forEach((val) => s += `${val.name} `);
            s += '<br>';
        }
    }

    // if the pokemon has a second type, add the second damage relations to the bottom of the first damage relations
    if (types.length > 1) {
        s += `<br>${types[1].type.name}:<br>`;
        const dmgData2 = await getDmg(types[1].type.name);
        for (const k in dmgData2) {
                if (k == 'double_damage_from' || k == 'half_damage_from' || k == 'no_damage_from') {
                s += `${k}: `;
                dmgData2[k].forEach((val) => s += `${val.name} `);
                s += '<br>';
            }
        }
    } 

    return s;
}

// show pokemon data
const pkmnData = (image, name, types, dmgRelations) => {
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
                    <p>Damage Relations:</p>
                    <p>${dmgRelations}</p>
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
    const dmgData = await dmgRelations(data.types);
    pkmnData(data['sprites']['other']['official-artwork']['front_default'], data.name, data.types, dmgData);
});