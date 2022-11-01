// use express router
const router = require('express').Router();

// import api routes
const apiRoutes = require('./api');

// enable our routes to the router
router.use('/api', apiRoutes);

// catch-all 404 route
router.use((req, res) => {
    res.status(404).send(`404! That page could not be found!`);
});

// export
module.exports = router;