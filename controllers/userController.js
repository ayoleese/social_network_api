// const  mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // GET all users
    async getUsers(req, res) {
        try {
            const result = await User.find().select('-__v');
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
            .populate('thoughts');
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
            const user = await User.create(req.body);
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
                return res.status(404).json({ message: 'No user with this ID'});
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
            await Thought.deleteMany({ userId: req.params.userId });
            
            res.json({ message: 'User and thoughts deleted' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Add friend
    async addFriend(req, res) {
        try { 
            // create variable called friendId with its own unique identifier(aka ID)
            const friendId = new ObjectId();
            // find user by id and adds friendID inside the friends array
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: friendId } }, // $addToSet ensures no duplicates
                { runValidators: true, new: true }
            ).select('-__v');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.save(); // saves into document

            res.json({ message: 'Friend added successfully', user });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error', err });
        }
    },

    // Delete friend
    async deleteFriend(req, res) {
        try {
            const friendId = new ObjectId(req.params.friendId);
            // find user by ID then by using $pull operator, it removes the element inside the array
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: friendId } }, // $pull removes specific elements from array
                { runValidators: true, new: true }
            ).select('-__v');
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