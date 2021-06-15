(function (dom) {
    
    var header = dom(".poke-survey-header");
    var submitBtn = dom("#pendo-button-2909cae0:contains('Submit Feedback')");
    
    function pokeSurvey(name) {
        header.text(`You chose ${name}!`);
    };
    
   submitBtn.on("mouseover", function (event){
        var textarea = dom("#pendo-textarea-453b93b1")[0];
       pendo.pro.pokeSurveyText = "";
       pendo.pro.pokeSurveyText = textarea.value;
       })
    .on("click", function(event){
       pendo.track("Poke Survey Feedback", {
           PokemonName: pendo.pro.chosenPokemon,
           SurveyFeedback: pendo.pro.pokeSurveyText
        });
    });
    
    
 pokeSurvey(pendo.pro.chosenPokemon);


}) (pendo.dom);