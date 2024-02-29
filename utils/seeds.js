const { User, Thought, Reaction } = require('../models');
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
            thoughts: ["Here's a cool thought..."],
            friends: [],
        }
    ];

    try {
        await User.deleteMany({});
        await Thought.deleteMany({});
        await Reaction.deleteMany({});

        await User.collection.insertMany(seed);

        console.table(seed);
        console.info('Seeding complete!');
    } catch (err) {
        console.error('Error while seeding: ', err);
    } finally {
        process.exit(0);
    }
});