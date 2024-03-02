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

            const newThought = new Thought({
                thoughtText: "",
                createdAt: new Date(),
                username: user.username,
                reactions: []
            });

            await user.save();
            user.thoughts.push(newThought);
            await newThought.save();
            
            await user.populate('thoughts').execPopulate();

            res.json({ user});
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
            const friendId = req.params.friendId;
            // find user by id and adds friend
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: friendId } }, // $addToSet ensures no duplicates
                { new: true }
            );

            if (!friend) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'Friend added successfully'});
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Delete friend
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndDelete(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } }, // $pull removes specific elements from array
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