const express = require('express');
//to connect to database
const { MongoClient } = require('mongodb');

//this is for single services
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
//ai data kaw ka dai or recive kori ,, jai kori nah kano ... data gola json formate a pabo. 
app.use(express.json());

//database uri and name and password
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hkgq0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//main function start // akana 2 main part try & finally //

async function run() {
    try {
        //ata kora hoi database ar sata server ar connect ar jonno
        await client.connect();
        const database = client.db('carMacanic');
        const serviceCollection = database.collection('services')
        // console.log('connected to database');

        //GET ALL THE INSERTED USER IN CLIENT SERVER
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        //get single services details 
        app.get('/services/:id', async (req, res) => {
            //j id ta cliant side thaka astaca , sai id ta req.params.id heasaba recive korbo.
            const id = req.params.id;
            console.log('getting specific id', id);

            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);

            //avaba o kora jaba.... 
            // const service = await serviceCollection.findOne({ _id: ObjectId(id) })

            res.json(service);
        })


        //POST API
        app.post('/services', async (req, res) => {
            // cliant side thaka ja data ta patacci , sai data ta server side a req.body ar vitor pabo.
            const service = req.body;

            console.log('hit the post', service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)

            //----- avaba o kora jaba--- jodi tomi pro hoya thako tahola.... 
            // res.json(await serviceCollection.insertOne(req.body));
        });






        //delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



//step 4
app.get('/', (req, res) => {
    res.send('Hello duniya!')
})

//step 5
app.listen(port, () => {
    console.log(`Running genius server on port ${port}`)
})

