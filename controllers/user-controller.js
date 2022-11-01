// dependencies
const { User, Thought } = require('../models');
const { checkFriend } = require('../utils/checkFriend');

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
    async updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: "No user found." });
                return;
            }
            // needs to also update username in thoughts
            return Thought.updateMany({ userId: params.id }, { username: userData.username });
        })
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err));
    },

    // delete a single user (along with their thoughts)
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: "No user found." });
                return;
            }
            return Thought.deleteMany({ userId: params.id });
        })
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err));
    },

    // friends!
    // add another user as a friend
    addFriend({ params }, res) {
        // check we aren't adding ourselves as a friend
        if (params.friendId == params.userId) {
            res.status(400).json({ message: "You cannot add yourself as a friend!" });
            return;
        } else {
            User.findOne({ _id: params.friendId })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: "User (friend) not found." });
                    return;
                }
                return User.findOne({ _id: params.userId });
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: "User not found." });
                    return;
                // check we are not already friends
                } else if (checkFriend(userData.friends, params.friendId)) {
                    res.status(400).json({ message: "User is already your friend." });
                    return;
                }
                // only now do we update
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { friends: params.friendId } },
                    { new: true, runValidators: true });
            })
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err));
        }
    },

    // delete user from friends
    removeFriend({ params }, res) {
        User.findOne({ _id: params.friendId })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: "User (friend) not found." });
                return;
            }
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { friends: params.friendId } },
                { new: true, runValidators: true });
        })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.json(userData);
        })
        .catch(err => res.status(400).json(err));
    }
};

// export controllers
module.exports = userController;