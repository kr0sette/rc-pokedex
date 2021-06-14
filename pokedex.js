(function pokemonModule(dom) {
    // Add your javascript here
    var moduleDiv = dom("#pendo-resource-center-container");
    var dropdownDiv = dom("#typeDropdown");
    var pokeListDiv = dom('#pokeList');
    var hideClass = "pokedex-hide";

    //Generate a dropdown list 
    createTypesDropdown();

    //Fetch list of pokemon types from API and add each type to the dropdown list
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

    //Fetch list of all pokemon names from API
    async function getPokemonList() {
        var url = 'https://pokeapi.co/api/v2/pokemon/?limit=1118';
        //var url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        var response = await fetch(url);
        var resultsJSON = await response.json();
        var pokemonList = resultsJSON.results;
        return pokemonList;
        //fetchPokemon(pokemon);
    }
    //Then loop thru results
    getPokemonList().then( function(res) {
        for (let i = 0; i < res.length; i++){
            var url = res[i].url;
            var regex = "(?<=pokemon\/)\\d+";
            var match = url.match(regex);
                        
            var id = parseInt(match[0]);
            var name = res[i].name;
            //then pass it onto template for an individual name for the list view
            createPokeList(id, name);    
        } 
    });


    //Template for element that contains individual pokemon name for the list view
    function createPokeList(id, name) {
                //Grab id and pad with leading 0s
                var displayID = JSON.stringify(id).padStart(3, '0');
                //Grab pokemon name and capitalize
                var pokeName = name[0].toUpperCase() + name.slice(1);
                var pokeElement = `<div class="pokeElement">
                    <div class='pokemonName' id='list-${name}' data-id='${id}'>${displayID}. ${pokeName}</div>
                </div>`;
                pokeListDiv.append(pokeElement);
    }


    //Fetch list of pokemon that has a specific type
    async function getPokemonByType(type) {
        var url = `https://pokeapi.co/api/v2/type/${type}`;
        var response = await fetch(url);
        var resultsJSON = await response.json();
        var pokemonByType = resultsJSON.pokemon;
        return pokemonByType;
    }

    //Fetch info for individual pokemon
    async function getPokemonInfo(id) {
        var url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        var response = await fetch(url);
        var pokemon = await response.json();
        return pokemon;
    }


    //Template for element that contains individual pokemon info
    function createPokeInfo(pokemon, element) {
        //Grab pokemon ID and pad it with leading 0s
        var displayID = JSON.stringify(pokemon.id).padStart(3, '0');
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
        var pokeElement = `<div class='infoTile' id='${pokemon.name}Info' data-id='tile-${pokemon.id}'>
    <p class='back'>Go Back</p>
    <h3 class='pokemonTitle'>#${displayID} ${pokeName}</h3>
    <div class="pokemonInfo" data-id='info-${pokemon.id}'>
        <img class='pokemonPic' data-id='picture-${pokemon.id}' src='${pokePic}'>
        <div class="pokemonInner" data-id='inner-${pokemon.id}'>
            <span class='pokemonType' data-id='type-${pokemon.id}'><b>Type:</b> ${pokeTypes}</span></br>
            <span class='pokemonHeight' data-id='height-${pokemon.id}'><b>Height:</b> ${pokeHeight}cm</span></br>
            <span class='pokemonWeight' data-id='weight-${pokemon.id}'><b>Weight:</b> ${pokeWeight}kg</span>
        </div>
    </div>
    <div class="poke-btn-container">
        <button class="choose-btn" value="${pokeName}" >I choose you!</button>
    </div>
</div>`;
        element.insertAdjacentHTML('afterend',pokeElement);
    }


//Event listeners
    moduleDiv
        //Open Pokemon info when you click on name in list view
        .on("click", ".pokemonName", function(event) {
            var id = event.target.getAttribute("data-id");
            var listName = event.target.parentNode;
            getPokemonInfo(id).then( function(res) {
                createPokeInfo(res, listName);
            });
            //Hide the list of pokemon names & the drop down
            hideDiv("#typeList");
            hideDiv(".pokemonName");
            

        })
        //Return from Pokemon info back to list view
        .on("click", ".back", function(event) {
            //Unhide the list of pokemon names & the drop down
            unhideDiv(".pokemonName");
            unhideDiv("#typeList");
            //Remove the pokemon Info
            var infoTileDiv = dom('.infoTile');
            infoTileDiv.remove();
        })
        //Select an option from dropdown to filter
        .on("change", "#typeDropdown", function(event) {
            //If a type is chosen, filter list by that type
            if (event.target.value !== "none") {
                pokeListDiv.html("");
                getPokemonByType(event.target.value).then(function (res){
                    for (var i = 0; i < res.length; i++){
                        var url = res[i].pokemon.url;
                        var regex = "(?<=pokemon\/)\\d+";
                        var match = url.match(regex);
                        
                        var id = parseInt(match[0]);
                        var name = res[i].pokemon.name;
                        createPokeList(id, name);
                    }
                });
            }
            //If "Select a type" is chose, go back to regular list view
            else {
                pokeListDiv.html("");
                getPokemonList().then( function(res) {
                    for (let i = 0; i < res.length; i++){
                        var id = i+1;
                        var name = res[i].name;
                        createPokeList(id, name);
                }   
                })
            };
        })
        //Reset filter & list view when you hit the clear link
        .on("click",".clear", function(event){
            var element = dom("#typeDropdown")[0];
            element.value = "none";
            pokeListDiv.html("");
            getPokemonList().then( function(res) {
                for (let i = 0; i < res.length; i++){
                    var id = i+1;
                    var name = res[i].name;
                    createPokeList(id, name);
                }   
            })
            
        })
        //Store the pokemon name when you hover over the "I choose you" button
        //Button with trigger survey guide
        .on("mouseover", ".choose-btn", function(event) {
            pendo.pro = {};
            pendo.pro.chosenPokemon = event.target.value;
        });
    
//Functions to hide/unhide elements
function hideDiv(element) {
        dom(element).addClass(hideClass);
    }

function unhideDiv(element) {
        dom(element).removeClass(hideClass);
    }
})(pendo.dom);
