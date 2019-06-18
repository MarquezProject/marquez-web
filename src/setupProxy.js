const proxy = require('http-proxy-middleware');

module.exports = function(app) { 
  // using MARQUEZ_SERVICE_SERVICE_PORT which is set by wek8s
  var apiOptions = {
    target: `http://${process.env.MARQUEZ_SERVICE_HOST}:${process.env.MARQUEZ_SERVICE_SERVICE_PORT}/`,
  };

  var govRewriteFn = function(path, req) {
    return path.replace('/governance/api', '/api');
  }; 

  // using MARQUEZ_GOVERNANCE_SERVICE_SERVICE_PORT_HTTP here which is set by wek8s
  var govOptions = {
    target: `http://${process.env.MARQUEZ_GOVERNANCE_HOST}:${process.env.MARQUEZ_GOVERNANCE_SERVICE_SERVICE_PORT}/`,
    pathRewrite: govRewriteFn
  };

  app.use(proxy('/api', apiOptions));
  app.use(proxy('/governance', govOptions));
};
