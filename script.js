Parse.initialize("noV3fZqC5tLPQxlls7LGis1Qx3zKVKjUEGZ8q2I5", "VOOmw8koyC92ZjJmMd3TRqIQuYmOQhUJ9Z2geQMy"); 
Parse.serverURL = "https://parseapi.back4app.com/";

var Pet = Parse.Object.extend("Pet");

var textName = "tomi";
var textAge = 10;

create();

function create() {
    mypet = new Pet();
    mypet.set("name", textName);
    mypet.set("agePet", textAge);

    mypet.save().then(function(pet){
         console.log('Pet created successful with name: ' + pet.get("name") + ' and age: ' + pet.get("agePet"));
    }).catch(function(error){
         console.log('Error: ' + error.message);
    });
}