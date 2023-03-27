const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/customers', {
            target: 'http://178.238.229.52:45730',
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware('/card-operations', {
            target: 'http://178.238.229.52:45730',
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware('/companies', {
            target: 'http://178.238.229.52:45730',
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware('/company-administrators', {
            target: 'http://178.238.229.52:45730',
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware('/funds-transfer', {
            target: 'http://178.238.229.52:45708',
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware('/company-contacts', {
            target: 'http://178.238.229.52:45730',
            changeOrigin: true,
        })
    )
};

