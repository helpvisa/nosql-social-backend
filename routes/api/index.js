// import express router
const router = require('express').Router();

// import routes from this folder
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

// add prefixes
router.use('/user', userRoutes);
router.use('/thought', thoughtRoutes);

// export
module.exports = router;