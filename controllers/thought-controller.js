// dependencies
const { User, Thought } = require('../models');

// write controller
const thoughtController = { // i'm in your mind...
    // api functions go here
    // create a thought
    createThought({ body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id }},
                { new: true }
            )
        })
        .then(thoughtData => {
            if (!thoughtData) {
                res.status(404).json({ message: "No user found." });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // retrieve sorted list of thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(thoughtData => res.json(thoughtData))
        .catch(err => res.status(400).json(err));
    },

    // retrieve a thought by _id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(thoughtData => {
            if (!thoughtData) {
                res.status(404).json({ message: "No thought found." });
                return;
            }
            res.json(thoughtData)
        })
        .catch(err => res.status(400).json(err));
    },

    // update a thought by _id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {new: true, runValidators: true})
        .then(thoughtData => {
            if (!thoughtData) {
                res.status(404).json({ message: "No thought found." });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete thought by _id
    deleteThought({ params }, res) {
        // first remove our thought
        Thought.findOneAndDelete({ _id: params.id })
        .then(thoughtData => {
            if (!thoughtData) {
                return ({ message: "No thought found." });
            }
            // now remove the reference within user's thoughts array
            return User.findOneAndUpdate(
                { _id: thoughtData.userId },
                { $pull: { thoughts: params.id } },
                { new: true }
            );
        })
        // and gracefully bounce if we somehow don't find a user (unclean deletion)
        .then(userData => {
            if (!userData) {
                return res.status(404).json({ message: "No user found for thought." });
            }
            res.json(userData);
        })
        .catch(err => res.status(400).json(err));
    }
};

// export controllers
module.exports = thoughtController;