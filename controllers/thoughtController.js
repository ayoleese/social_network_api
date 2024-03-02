const { User, Thought } = require('../models');

module.exports = {
    // Get ALL thoughts
    async getThoughts(req, res) {
        try {
            const thought = await Thought.find();
            res.json(thought);
        } catch (err) {
            // console.log(err);
            res.status(500).json(err);
        }
    },
    // Get a single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');
            if(!thought){
                return res.status(404).json({ message: 'No thoughts with that ID'})
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            // find and connect thought by username
            const user = await User.findByIdAndUpdate(
                { username: req.params.username },
                { $push: { thoughts: req.params.thoughtId }},
                { new: true }
            );
            if (!user) {
                await Thought.findByIdAndDelete(req.params.thoughtId);
                return res.status(404).json({ message: 'Username is needed, try again'});
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Update thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {new: true });
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Delete thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Add reaction
    async addReaction(req,res) {
        try{
            const { thoughtId } = req.params;
            const { reactionId } = req.body;

            if(!thoughtId || !reactionId) {
                return res.status(400).json({ message: 'Invalid thoughtId or reactionId' });
            }

            const thought = await Thought.findOneAndUdpate (
                { _id: thoughtId },
                { $addToSet: { reactions: reactionId } },
                { new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found'});
            }
            res.json({ message: 'You reacted on a thought', thought });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Remove reaction
    async deleteReaction(req, res) {
        try {
            const { thoughtId } = req.params;
            const { reactionId } = req.body;

            if(!thoughtId || !reactionId) {
                return res.status(400).json({ message: 'Invalid thoughtId or reactionId'});
            }
            const thought = await Thought.findOneAndDelete(
                { _id: thoughtId },
                { $pull: { reactions: reactionId }},
                { new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found'});
            }
            res.json({ message: 'Reaction removed' });
        } catch (err) {
            res.status(500).json(err);
        }
    }
};