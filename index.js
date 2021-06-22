const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');


const MongoClient = require('mongodb').MongoClient;
const admin = require('firebase-admin');


require("dotenv") .config();
console.log(process.env.DB_PASS)

const app = express();
app.use(cors());

app.use(bodyParser.json());




const port = process.env.PORT || 55000;

const serviceAccount = require("./aignment-10-firebase-adminsdk-3f278-fe2acd8cee.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});














app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.beono.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection err", err)
  
    const gameCollection = client.db("assaignment-10").collection("items");
    const gameCollection2 = client.db("assaignment-10").collection("ordered item");


    app.get("/events",(req,res)=>{
      gameCollection.find()
      .toArray((err, items)=>{
        res.send(items)
        console.log("from database",items)
      })
    });
 
    app.post("/addEvents",(req,res)=>{
    const newGame = req.body;
    console.log("adding new game", newGame)
    gameCollection.insertOne(newGame)
    .then(result=>{
console.log('inserted count',result.insertedCount)
res.send(result.insertedCount>0)
    
})
    })

app.post('/orders', (req,res)=>{

  const newOrder = req.body;
  gameCollection2.insertOne(newOrder)
  .then(result=>{
    res.send(result.insertedCount>0);
  })
  console.log(newOrder)
})

app.get('/orders',(req,res)=>{
  console.log(req.query.email)
 const bearer = req.headers.authorization;
if(bearer && bearer.startsWith('Bearer ')){
  const idToken = bearer.split(' ')[1];
  console.log({idToken});
  admin.auth().verifyIdToken(idToken)
.then((decodedToken) => {
  const tokenEmail = decodedToken.email;
  const quaryEmail = req.query.email;
  console.log(quaryEmail ,tokenEmail)
  if(tokenEmail == req.query.email){
    gameCollection2.find({email:req.query.email})
    .toArray((err, documents)=>{
      res.send(documents);
    })

  }
})
.catch((error) => {
  // Handle error
});
  
}
  
 






  
})

 
//   client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})