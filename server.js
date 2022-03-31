//import fs and path to write the data to animals.json
const fs = require('fs')
const path = require('path')

const { animals } = require('./data/animal.json')

//to get the express package use require
const express = require('express');
const { fileURLToPath } = require('url');
const PORT = process.env.PORT || 3001;
const app = express();

//insructs server to make certain files readily available and to not gate it behind a sever endpoint
        //public is the directory where all the files are stored such as the css and images
app.use(express.static('public'))

//parse incoming string or array data
app.use(express.urlencoded({extended: true}))
//parse incoming json data
app.use(express.json())

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
                animal => animal.personalityTraits.indexOf(trait) !== -1)
                
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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result
}

function createNewAnimal(body, animalsArray) {
    console.log(body);
    //our function's main code will go here
    const animal = body
    animalsArray.push(animal)

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({animals : animalsArray}, null, 2)
    )

    //return finished code to post route for response
    return animal
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
      }
    if(!animal.species || typeof animal.species !== 'sring'){
        return false
    }
    if(!animal.diet|| typeof animal.diet !== 'sring'){
        return false
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false
    }
    return true

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

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals)
    if(results){
        res.json(result)
    }else{
        res.send(404)
    }
})

//post is the action of a client requesting the server to accept data
app.post('/api/animals', (req, res) => {
    //set id based on what the next index of the array will be 
    req.body.id = animals.length.toString()
    //req.body is hwere our incoming content will be


    //if any data in the req.body is incorrect, send 404 error back
    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.')
    }else{
        //add animals to json file and animals in this function
    const animal = createNewAnimal(req.body, animals)
    res.json(req.body)

    }
})

//add route for index.html. homepage uses just '/' for the server and res.sendFile()
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})
//make server listen use .listen() method
app.listen(PORT, () => {
    console.log(`API server on port ${PORT}`)
})