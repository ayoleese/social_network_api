const { User, Thought } = require('../models');
const connection = require('../config/connection');
// database connection error
connection.on('error', (err) => {
    console.error('Database connection error: ', err);
});
// display connection is functioning
connection.once('open', async () => {
    console.log('Connected to database');

    const seed = [
        {
            username: "lernantino",
            email: "lernantino@gmail.com",
            thoughts: [],
            friends: [],
        }
    ];

    try {
        // Clearing any existing data
        await User.deleteMany({});
        await Thought.deleteMany({});
        // await Reaction.deleteMany({});

        // seed database
        await User.collection.insertMany(seed);
        // logs seed
        console.table(seed);
        console.info('Seeding complete!');
    } catch (err) {
        // display error when seeding goes wrong
        console.error('Error while seeding: ', err);
    } finally {
        process.exit(0);
    }
});