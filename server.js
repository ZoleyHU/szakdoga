const {createServer} = require('http');
const next = require('next');

const app = next({
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(app.port || 3000, (err) => {
        if (err) throw err;
        console.log('Ready on localhost:3000');
    });
});

//source: https://github.com/fridays/next-routes#on-the-server