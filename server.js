const { animals } = require('./data/animal.json')

//to get the express package use require
const express = require('express');
const { fileURLToPath } = require('url');
const app = express();

function filterByQuery(query, animalsArray) { 
    let personalityTraitsArray = []
    //we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray
    if(query.personalityTraits){
        //save personalityTraits as a dedicated array
        //If personalityTrais is a string, place it into a new array and save.
        if(typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits]
        }else{
            personalityTraitsArray = query.personalityTraits;
        }
        //loop through each trait in the personailityTraits array:
        personalityTraitsArray.forEach(trait =>{
            //check the trait agianste each animal in the filteredResults array.
            //remember, it is initially a copy of the animalsArray
            //but here we're updating it for each trait in the .forEach() loop
            //for each trait being targeted by the filter, the filteredResults array will then contain ony the entries that contain the trait,
            //so at the end we'll have an array of animals that have every
            //of the trait when the forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1;
                )
        })
    }
    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet)
    }
    if(query.species){
        filteredResults =  filteredResults.filter(animal => animal.species === query.species)
    }
    if(query.name){
        filteredResults =  filteredResults.filter(animal => animal.name === query.name)
    }
    return filteredResults;
}

//route
app.get('/api/animals', (req, res) => {
    //results equals the object in data file
    let results = animals
   if(req.query){
       results = filterByQuery(req.query, results)
   }
   res.json(results)
})
//make server listen use .listen() method
app.listen(3001, () => {
    console.log(`API server on port 3001!`)
})