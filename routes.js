const routes = require('next-routes')();

routes
    .add('/services/new', '/services/new')
    .add('/services/:address', '/services/info');

module.exports = routes;