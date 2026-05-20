require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

app.use(express.json());


// database and collection create and send data
let allpets;
let adoptedpets

async function run() {
    try {
        await client.connect();

        const db = client.db("assainment-09-server");
        allpets = db.collection('allpets');
        adoptedpets = db.collection('adoptedpets')

    } catch (error) {
        console.log(error);
    }
}

run();

app.get('/', async (req, res) => {
    try {
        const cursor = allpets.find();
        const result = await cursor.toArray();
        console.log(result);

        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to fetch users',
            error: error.message,
        });
    }
});


// Get Single User By ID
app.get('/public/all-pets/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const query = {
            _id: new ObjectId(id),
        };

        const result = await allpets.findOne(query);

        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to fetch user',
            error: error.message,
        });
    }
});


// get api for getting all adopted pets
app.get('/public/all-adopted-pets', async (req, res) => {
    try {
        const cursor = adoptedpets.find();
        const result = await cursor.toArray();


        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to fetch users',
            error: error.message,
        });
    }
})






app.post('/dashboard/add-pet', async (req, res) => {
    const result = await allpets.insertOne(req.body);
    res.send(result);
    console.log(result);
});

// adopted pets api
app.post('/public/all-pets/:id', async (req, res) => {
    const result = await adoptedpets.insertOne(req.body);
    res.send(result);
    console.log(result);
});

// Delete User By ID
app.delete('/dashboard/my-listings/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);

        const query = {
            _id: new ObjectId(id),
        };

        const result = await allpets.deleteOne(query);

        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to delete user',
            error: error.message,
        });
    }
});

// Data Edit/Update Route
app.patch('/dashboard/my-listings/:id', async (req, res) => {
    const userId = req.params.id;
    const { name } = req.body; // Frontend theke pathano data

    const filter = { _id: new ObjectId(userId) };

    const updateDoc = {
        $set: req.body
    };

    const result = await allpets.updateOne(
        filter,
        updateDoc
    );

    res.send(result);
});

app.listen(8000, () => {
    console.log('Server running');
});