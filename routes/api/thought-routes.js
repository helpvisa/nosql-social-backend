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
const {
    createReaction,
    deleteReaction
} = require('../../controllers/reaction-controller');

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

// set up PUT, DELETE for reactions
router
    .route('/:thoughtId/reactions')
    .post(createReaction);
router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

// export routes
module.exports = router;