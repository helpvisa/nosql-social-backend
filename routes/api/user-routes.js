// dependencies
const router = require('express').Router();
// import controller functions
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
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

// export routes
module.exports = router;