import   express from 'express';
import  bodyParser from 'body-parser';
import  bcrypt from 'bcrypt-nodejs';
import  cors from 'cors';
import  knex from 'knex';
import  register from './controllers/register.js';
import  login from './controllers/signIn.js';
import  image from './controllers/image.js';
import  profile from './controllers/profile.js';

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