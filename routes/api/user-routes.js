// dependencies
const router = require('express').Router();
// import controller functions
const {
    createUser,
    getAllUsers,
    getUserById,
    getUserByName,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/user-controller');

// set up GET ALL and POST
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// set up GET, PUT, DELETE with params
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// set up GET by username
router
    .route('/name/:username')
    .get(getUserByName);

// set up PUT for add and remove friend
router
    .route('/:userId/friends/:friendId')
    .put(addFriend)
    .delete(removeFriend);

// export routes
module.exports = router;