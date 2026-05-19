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

async function run() {
    try {
        await client.connect();

        const db = client.db("assainment-09-server");
        allpets = db.collection('allpets');

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




app.post('/dashboard/add-pet', async (req, res) => {
    const result = await allpets.insertOne(req.body);
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
app.put('/dashboard/my-listings/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, role } = req.body; // Frontend theke pathano data

    // User-ti database-e ache kina khonja
    let user = users.find(u => u.id === userId);

    if (user) {
        // Data update kora
        user.name = name || user.name;
        user.role = role || user.role;

        res.status(200).json({ success: true, message: "Data updated successfully!", updatedUser: user });
    } else {
        res.status(404).json({ success: false, message: "User not found!" });
    }
});

app.listen(8000, () => {
    console.log('Server running');
});