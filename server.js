import  express from 'express';
import  bodyParser from 'body-parser';
import  bcrypt from 'bcrypt-nodejs';
import  cors from 'cors';
import  knex from 'knex';
import  handleRegister from './controllers/register.js';
import  signInHandler from './controllers/signIn.js';
import  {imageHandler, handleApiCall} from './controllers/image.js';




const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_DB,
    password: process.env.DATABASE_PW,
    ssl: { rejectUnauthorized: false } ,
  }
})


const app = express();
app.use(bodyParser.json());
app.use(cors());


//sign in POST
app.post('/signin', (req,res)=> {signInHandler(req,res,db,bcrypt)} )

//register:POST
app.post('/register',(req,res)=> {handleRegister(req,res,db,bcrypt)})

//getting the user data
app.get('/profile/:id',(req,res)=>{profileHandler(req,res,db)});


//counting the entries /image PUT
app.put('/image',(req,res)=> {imageHandler(req,res,db)})
app.post('/imageurl',(req,res)=> {handleApiCall(req,res)})

app.listen(3000, ()=>{
    console.log('app is running on port 3000')
})