// dependencies
const { User, Thought } = require('../models');

// write controller
const userController = {
    // api functions go here
    // create a user
    createUser({ body }, res) {
        User.create(body)
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err));
    },

    // get a sorted list of all users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: ['-__v', '-username']
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err));
    },

    // get data of single user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: ['-__v', '-username']
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(userData => {
            // return if no user is found
            if (!userData) {
                res.status(404).json({ message: "No user found." });
                return;
            }
            // else return user data
            res.json(userData);
        })
        .catch(err => res.status(400).json(err));
    },

    // get data of single user by username
    getUserByName({ params }, res) {
        User.findOne({ username: params.username })
        .populate({
            path: 'thoughts',
            select: ['-__v', '-username']
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(userData => {
            // return if no user is found
            if (!userData) {
                res.status(404).json({ message: "No user found." });
                return;
            }
            // else return user data
            res.json(userData);
        })
        .catch(err => {
            res.status(400).json(err);
        });
    },

    // update a single user
    updateUser({ params, body }, res) {
        // don't give us updated name; we want to use the old one for changing thoughts
        User.findOneAndUpdate({ _id: params.id }, body, { new: false, runValidators: true })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: "No user found." });
                return;
            }
            // needs to also update username in thoughts
            Thought.updateMany({ username: userData.username }, { username: body.username });
            res.json({ message: "User information updated." });
        })
        .catch(err => res.status(400).json(err));
    },

    // delete a single user
    //// -=-todo: delete thoughts upon user deletion-=- ////
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: "No user found." });
                return;
            }
            res.json(userData);
        })
        .catch(err => res.status(400).json(err));
    },
};

// export controllers
module.exports = userController;