const proxy = require('http-proxy-middleware');

module.exports = function(app) { 
  var apiOptions = {
    target: `http://${process.env.MARQUEZ_SERVICE_HOST}:${process.env.MARQUEZ_SERVICE_PORT}/`,
  };

  var govRewriteFn = function(path, req) {
    return path.replace('/governance/api', '/api');
  }; 

  var govOptions = {
    target: `http://${process.env.MARQUEZ_GOVERNANCE_HOST}:${process.env.MARQUEZ_GOVERNANCE_PORT}/`,
    pathRewrite: govRewriteFn
  };

  app.use(proxy('/api', apiOptions));
  app.use(proxy('/governance', govOptions));
};
