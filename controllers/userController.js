const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // GET all users
    async getUsers(req, res) {
        try {
            const result = await User.find();
            res.status(200).json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // GET a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId})
            .select('-__v')
            .populate('thought');
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create a user
    async createUser(req, res) {
        try {
            const user = await User.insertOne(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // Update a user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!user) {
                res.status(404).json({ message: 'No user with this ID'});
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Delete a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });
            if (!user) {
                return res.status(404).json({ message: 'User does not exist'});
            }
            // when user is delete, thought is deleted as well
            await Thought.deleteMany({ _id: { $in: user.thought } });
            res.json({ message: 'User and thoughts deleted' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Add friend
    async addFriend(req, res) {
        try {
            const { userId } = req.params;
            const { friendId } = req.body;

            if (!ObjectId.isValid(userId) || !ObjectId.isValid(friendId)) {
                return res.status(400).json({ message: 'Invalid userId or friendId' });
            }

            const user = await User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { friends: friendId } }, // $addToSet ensures no duplicates
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'Friend added successfully', user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Delete friend
    async deleteFriend(req, res) {
        try {
            const { userId, friendId } = req.params;

            if (!ObjectId.isValid(userId) || !ObjectId.isValid(friendId)) {
                return res.status(400).json({ message: 'Invalid userId or friendId' });
            }

            const user = await User.findOneAndDelete(
                { _id: userId },
                { $pull: { friends: friendId } }, // $pull removes specific elements from array
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'Friend deleted successfully', user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};