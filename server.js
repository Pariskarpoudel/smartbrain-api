// both frontend and backenda are different computers, server is on different computer, here server is on port 3000 annd listening it , it doesnt give a fuckk where is the frontend, it only respond to req either they are from website or from postman 
// ani yo /signin  vaneko serverko afnai auta route  ho, frontend sita esko kei lena dena chaina, frontend ma ni baru /signin vanera navigation route rakhna sakiyo  hamle but it will be independent
const express = require('express')

const app = express()
const bcrypt = require('bcrypt-nodejs')
var cors = require('cors')
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const image = require('./controllers/image.js')
const postgres = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
    //   port : 3306, coz yo db kunai portma xaina
      user : 'postgres',
      password : 'test',
      database : 'smartbrain'
    }
  });

// postgres.select('*').from('users').then((response)=>{console.log(response)});

const database = {
    users: [{
        id: '123',
        name: 'John',
        email: 'john@gmail.com',  
        entries: 0,               // kati ota photo detect garyo -> for ranking
        password: 'cookies',
        joined: new Date()   
    },
    {
        id: '124',
        name: 'Sally',
        email: 'sally@gmail.com',
        entries: 0,        
        password: 'bananas',        
        joined: new Date()   
}],

    login: [{
        id: '123',
        hash: '',
        email: 'john@gmail.com'
    }]

}

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors())  // uta failed to fetch vanethyo coz server didnt responded with cors headers, or response dont contain cors header,so serverma cors contain vayo esari, ani uta frontend ma failed to fetch dekhayena
app.get('/', (req,res)=>{
    // res.send("This is working")   We wanna receive and send json , so res.json() gare hunxa
    // res.json(database.users)
    res.json('Success')            
})

app.post('/signin',(req,res)=>{signin.handleSignin(req,res,postgres,bcrypt)})

// app.post('/register', handleRegister(req,res))  // by default yo function ko arg ko roopma req ra res auxa , but i also wanna send postgres and bcrypt 
app.post('/register', (req,res)=>{register.handleRegister(req,res,postgres,bcrypt)})

app.get('/profile/:id',(req,res)=>{profile.handleProfileGet(req,res,postgres)})

app.put('/image',(req,res)=>{image.handleImage(req,res,postgres)})

app.post('/imageurl',(req,res) => {image.handleApiCall(req,res)})

// app.listen(process.env.PORT || 3000) huna  parniho, kailekai render ko env le nai port assign garxa  3000 available navaepar, but aile chai milyo so xod
app.listen(process.env.PORT || 3000, ()=>{
    console.log("App is running on port 3000")
})


// Basic Structure 
// / - GET => this is working                     => means response
// /signin - POST => success/fail
// /register - POST => user 
// /profile/:userId - GET => user
// /image - PUT => user       (score update garni wala)

// DIsadv of not using databases:
// signin garda users lai match garna for loop chalayera check garna parthyo which is not efficient, so we use database , it has efficientt builtin ways to search data, we can simply do db.query.get(), maile loop launa pardena
// server.js ma kei ni codema change garda bitikai, server restart hunxa [nodemon] restarting due to changes 
// so users ma statically diyeka duita users matra rahanxan, agi register gareko user rahanna, so databasee ma store garxann externall thau maaa, so when server restarts , we lost our added data or users

// password security
// userle form submit garda password123 jo submit hanxa, use https, and database ma store garda chai actual pass haina tesko hashed form store garni , so db hack vaesi ni heckerle tha paunna 
// khasma auta string ko hashfunctionle auta fixed hash banauxa , paridon123 lai hash func ma pathaye sadai hashed value = same rahanxa,  but  bcrypt more secure, so paridon123 lai jati chati hashfunc ma pathayeni farak hashedpassword dinxa, but compare garda: paridon123 matches with anyy of the hashed passwordss, so baal vaena
// database ma store garda hashed password store garinxa



// environment variables 
// https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786  
// https://medium.com/free-code-camp/heres-how-you-can-actually-use-node-environment-variables-8fdf98f53a0a , yo resource ko production environment variables wala topic her: 
// So far we’ve looked at how to define variables for development. You likely won’t use .env files in production 
// harek hosting platform ko aafnai environment hunxa, ani tnma environment variables set garni tarika ni platform anusar farak hunxa
// development phaseko lagi .env files use garda ni github ma code halda chai eslai gitignore ma halni coz we dont want anyone to see essential credentials
// github pages can only host frontend only , not backend