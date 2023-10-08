const  express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const login = require('./controllers/signIn');
const image = require('./controllers/image.js');
const profile = require('./controllers/profile');

const db = knex({
        client: 'pg',
        connection: {
          host : '127.0.0.1',
          port : 5432,
          user : 'postgres',
          password : 'hloni',
          database : 'smart-brain'
        }  

})


const app = express();
app.use(bodyParser.json());
app.use(cors());


//sign in POST
app.post('/signin', (req,res)=> {login.signInHandler(req,res,db,bcrypt)} )

//register:POST
app.post('/register',(req,res)=> {register.handleRegister(req,res,db,bcrypt)})

//getting the user data
app.get('/profile/:id',(req,res)=>{profile.profileHandler(req,res,db)});


//counting the entries /image PUT
app.put('/image',(req,res)=> {image.imageHandler(req,res,db)})
app.post('/imageurl',(req,res)=> {image.handleApiCall(req,res)})

app.listen(3000, ()=>{
    console.log('app is running on port 3000')
})