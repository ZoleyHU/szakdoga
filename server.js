// const {createServer} = require('http');
const next = require('next');
const express = require('express');

const app = next({
    dev: process.env.NODE_ENV !== 'production'
});

const routes = require('./routes');
console.log(routes)
const handler = routes.getRequestHandler(app);

const port = process.env.PORT || 3000;
console.log(port)

app.prepare().then(() => {
    express().use(handler).listen(port, (err) => {
        if (err) throw err;
        console.log('Ready on port: '+port);
    });
});

//source: https://github.com/fridays/next-routes#on-the-server