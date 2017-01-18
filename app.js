'use strict'

var koa = require('koa');

var app = new koa();

app.use(ctx => {
    ctx.body = "hello world";
});

module.exports = app;
