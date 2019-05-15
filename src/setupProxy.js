const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api', { target: `http://${process.env.MARQUEZ_SERVICE_HOST}:${process.env.MARQUEZ_SERVICE_PORT}/` }));
};
