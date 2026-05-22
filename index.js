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

const checkAuth = (req, res, next) => {
    const header = req.headers.authorization;
    console.log(req.headers.authorization);
    if (header === 'login') {
        next();
    } else {
        res.status(401).json({ message: 'unothorised' })
    }
};

app.get('/', async (req, res) => {
    try {
        const result = await allpets.find().toArray();
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

// get a single adopedted pets by id
app.get('/public/all-adopted-pets/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const query = {
            _id: id,
        };

        const result = await adoptedpets.findOne(query);

        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to fetch user',
            error: error.message,
        });

    }
});



// post api for add-pet
app.post('/dashboard/add-pet', async (req, res) => {
    const result = await allpets.insertOne(req.body);
    res.send(result);
});

// adopted pets api
app.post('/public/all-pets/:id', async (req, res) => {
    const result = await adoptedpets.insertOne(req.body);
    res.send(result);
});

// Delete User By ID
app.delete('/dashboard/my-listings/:id', async (req, res) => {
    try {
        const id = req.params.id;

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

// Delete api is created for handling user adoptation cancel request
app.delete('/dashboard/my-requests/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {
            _id: id,
        };

        const result = await adoptedpets.deleteOne(query);

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
app.patch('/public/all-adopted-pets/:id', async (req, res) => {
    const userId = req.params.id;

    const filter = { _id: userId };

    const updateDoc = {
        $set: req.body
    };

    const result = await adoptedpets.updateOne(
        filter,
        updateDoc
    );
    res.send(result);
});


// Data Edit/Update Route
app.patch('/dashboard/my-listings/:id', async (req, res) => {
    const userId = req.params.id;

    const filter = { _id: new ObjectId(userId) };

    const updateDoc = {
        $set: req.body
    };

    const result = await allpets.updateOne(
        filter,
        updateDoc
    );
    res.send(result);
    console.log(updateDoc);
});


app.listen(8000, () => {
    console.log('Server running');
});