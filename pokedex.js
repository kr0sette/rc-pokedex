(function pokemonModule(dom) {
    // Add your javascript here
    var moduleDiv = dom("#pendo-resource-center-container");
    var dropdownDiv = dom("#typeDropdown");
    var pokeListDiv = dom('#pokeList');
    var originalPokeCount = 151;
    var hideClass = "pokedex-hide";
    //Start by generating a dropdown list & a list of 151 pokemon and placing them on the page    
    createTypesDropdown();
    fetchPokemon();
    //Fetch list of pokemon types and add each type to the dropdown list
    async function createTypesDropdown() {
        var url = 'https://pokeapi.co/api/v2/type/';
        var response = await fetch(url);
        var resultsJSON = await response.json();
        var pokemonTypes = Object.values(resultsJSON.results);
        pokemonTypes.forEach(
            function(type) {
                //Grab type name and capitalize
                var typeName = type.name[0].toUpperCase() + type.name.slice(1);
                dropdownDiv.append(`<option value="${type.name}">${typeName}</option>`)
            });
    }
    //Fetch info for 151 pokemon from API
    function fetchPokemon() {
        for (let i = 1; i <= originalPokeCount; i++) {
            getPokemon(i);
        }
    };
    //Fetch the individual info from PokeAPI
    async function getPokemon(id) {
        var url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        var response = await fetch(url);
        var pokemon = await response.json();
        createPokeContent(pokemon, pokemon.id);
    }
    //Fetch list of pokemon with a specific type
    async function getPokemonByType(type) {
        var url = `https://pokeapi.co/api/v2/type/${type}`;
        var response = await fetch(url);
        var resultsJSON = await response.json();
        var pokemonByType = Object.values(resultsJSON.pokemon);
        //console.log(pokemonByType);
        pokemonByType.forEach(
            function(res) {
                getPokemon(res.pokemon.name);
            });
    }
    //Generate list of pokemon to display
    function createPokeContent(pokemon, id) {
        //Grab pokemon ID and pad it with leading 0s
        var displayID = JSON.stringify(id).padStart(3, '0');
        //Grab pokemon name and capitalize
        var pokeName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
        //Grab pokemon type
        var typeArray = [];
        if (Object.keys(pokemon.types).length === 1) {
            typeArray.push(pokemon.types[0].type.name);
        } else {
            pokemon.types.forEach(function(res) {
                typeArray.push(res.type.name);
            })
        }
        var pokeTypes = typeArray.join(", ");
        //Grab pokemon picture
        var pokePic = pokemon.sprites.front_default;
        //Grab pokemon height
        var pokeHeight = pokemon.height * 10;
        //Grab pokemon weight
        var pokeWeight = pokemon.weight / 10;
        //Put API info into DOM
        var pokeElement = `<div class="pokeElement">
    <p class='pokemonName' id='${pokemon.name}' data-id='${id}'>${displayID}. ${pokeName}</p>
</div>
<div class='infoTile pokedex-hide' id=''${pokemon.name}Info' data-id='tile-${id}'>
    <p class='back'>Go Back</p>
    <h3 class='pokemonTitle'>#${displayID} ${pokeName}</h3>
    <div class="pokemonInfo" data-id='info-${id}'>
        <img class='pokemonPic' data-id='picture-${id}' src='${pokePic}'>
        <div class="pokemonInner" data-id='inner-${id}'>
            <span class='pokemonType' data-id='type-${id}'><b>Type:</b> ${pokeTypes}</span></br>
            <span class='pokemonHeight' data-id='height-${id}'><b>Height:</b> ${pokeHeight}cm</span></br>
            <span class='pokemonWeight' data-id='weight-${id}'><b>Weight:</b> ${pokeWeight}kg</span>
        </div>
    </div>
    <div class="poke-btn-container">
        <button class="choose-btn" value="${pokeName}" >I choose you!</button>
    </div>
</div>`;
        pokeListDiv.append(pokeElement);
    }
    moduleDiv
        //Open Pokemon info when you click on name in list view
        .on("click", ".pokemonName", function(event) {
            //Hide the list of pokemon names & the drop down
            hideDiv("#typeDropdown");
            hideDiv(".pokemonName");
            //Unhide and display just the pokemon info
            var parent = event.target.parentNode;
            unhideDiv(parent.nextElementSibling);
        })
        //Return from Pokemon info back to list view
        .on("click", ".back", function(event) {
            //Unhide the list of pokemon names & the drop down
            unhideDiv(".pokemonName");
            unhideDiv("#typeDropdown");
            //Unhide and display just the pokemon info
            hideDiv(event.target.parentNode);
        })
        //Select an option from dropdown to filter
        .on("change", "#typeDropdown", function(event) {
            //If a type is chose, filter list by that type
            if (event.target.value !== "none") {
                pokeListFilter = [];
                pokeListDiv.html("");
                getPokemonByType(event.target.value);
            }
            //If "Select a type" is chose, go back to regular list view
            else {
                pokeListDiv.html("");
                fetchPokemon();
            }
        })
        .on("mouseover", ".choose-btn", function(event) {
            //var chosenPokemon = "test";
            //console.log(event.target.value);
            pendo.pro = {};
            pendo.pro.chosenPokemon = event.target.value;
        });
    function hideDiv(element) {
        dom(element).addClass(hideClass);
    }
    function unhideDiv(element) {
        dom(element).removeClass(hideClass);
    }
})(pendo.dom);
