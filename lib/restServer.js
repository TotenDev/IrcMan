//
// index.js — IrcMan
// today is 11/15/12, it is now 08:25 PM
// created by TotenDev
// see LICENSE for details.
//

//Modules
var restify = require('restify'),
    assert = require('assert');
/**
* Initialize restServer function
**/
module.exports = function (basicAuthUser,basicAuthPass,routesCallback) { return new restServer(basicAuthUser,basicAuthPass,routesCallback); }
function restServer(basicAuthUser,basicAuthPass,routesCallback) {
    restServerInstance = this;
    restServerInstance.basicAuth = {user:basicAuthUser,pass:basicAuthPass};
    restServerInstance.route = routesCallback;
    restServerInstance.serverPort = (process.env.PORT || 8080);
    //Start Server
    restServerInstance.startRestServer();
}

/* Public Functions */
restServer.prototype.closeServer = function closeServer() {
  restServerInstance.server.close(function () {
    console.log("Stopped");
  });
}
restServer.prototype.startRestServer = function startRestServer() {
  restServerInstance.server = server = restify.createServer({
    name:"restServer"
  });
  //Server checks
  restServerInstance.server.pre(function(req, res, next) { restServerInstance.authenticateRequest(req,res,next); });
  //Router
  restServerInstance.server.post('[a-zA-Z0-9-_~/\\.%]*', restServerInstance.routeRequest);
  restServerInstance.server.listen(restServerInstance.serverPort , function() {
    console.log('%s listening at %s', server.name, server.url);
  });
}

/* Private Util Functions */
restServer.prototype.listenServerEvents = function listenServerEvents() {
  restServerInstance.server.on("after",function (request, response, route) {
    console.log("after all");
  });
  restServerInstance.server.on("uncaughtException",function (request, response, route, error) {
    console.log("exception-->> " + error.stack);
  });
}
restServer.prototype.authenticateRequest = function authenticateRequest(req,res,next) {
  //Check
  if(!req.headers["authorization"]) { res.send(401,new Error("Unauthorized.")); }
  else { 
    //Try to parse auth
    var auth = new Buffer(req.headers["authorization"], 'base64').toString('ascii');
    auth = auth.replace("Basic ","");
    auth = auth.split(':');
    if (auth.length >= 2) {
      req.username = auth[0], req.password = auth[1], auth = null;
      return next();
    }else { res.send(401,new Error("Unauthorized.")); return; }
  }
}

//Main Route
restServer.prototype.routeRequest = function routeRequest(req, res, next) {
  //auth check 
  if (req.username != restServerInstance.basicAuth.user || req.password != restServerInstance.basicAuth.pass) {
    if (server) res.send(403,new Error("Forbidden :("));
    return ;
  }
  else { /*Continue*/}
  //
  var data = '',
      errored = false;
  req.on('data',function (chunk) { if (!errored ) data += chunk; });
  req.on('error',function (err) { console.log('request error:',err) ;errored = true; });
  req.on('end',function () {
    if (!errored && !restServerInstance.route(req.path,data,restServerInstance.getClientIp(req),res)) {
      res.send(404,new Error("route not found :("));
    }
  });
}
restServer.prototype.getClientIp = function getClientIp(request){ 
    with(request) 
      return ((headers['x-forwarded-for'] || '').split(',')[0] || connection.remoteAddress);
      console.log(((headers['x-forwarded-for'] || '').split(',')[0] || connection.remoteAddress));
}