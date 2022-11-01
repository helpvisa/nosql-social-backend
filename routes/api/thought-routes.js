// dependencies
const router = require('express').Router();
// import controller functions
const {
    createThought,
    getAllThoughts,
    getThoughtById,
    updateThought,
    deleteThought
} = require('../../controllers/thought-controller');

// set up GET ALL and POST
router
    .route('/')
    .get(getAllThoughts)
    .post(createThought);

// set up GET, PUT, DELETE with params
router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

// export routes
module.exports = router;