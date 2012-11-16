//
// serverRoutes.js — APNRS
// today is 10/14/12, it is now 10:25 PM
// created by TotenDev
// see LICENSE for details.
//
  
var tap = require("tap"),
    restify = require('restify');
    //
var server = require('./../index.js');
    //
var basicAuth = "Basic " + new Buffer("testUser:testPassword").toString('base64');

setTimeout(function () {
  tap.test("\nRouting",function (t) {
    t.plan(4);
    var client1 = restify.createJsonClient({ url: 'http://127.0.0.1:8080', headers: { 'Authorization':basicAuth }});
    client1.post("/listNotFound",{ hello: 'world' },function (err,req,res,obj) {
      t.equal(res.statusCode,404,"(404) Route not found for server credentials. (OK)");
    });
    var client2 = restify.createJsonClient({ url: 'http://127.0.0.1:8080', headers: { 'Authorization':'c2FtcGxlOnRleHQ=','Accept':"application/json",'Content-Type':"application/json" }});
    client2.post("/list2",{ hello: 'world' },function (err,req,res,obj) {
      t.equal(res.statusCode,403,"(403) Forbidden for client credentials with route not found. (OK)");
    });
    var client3 = restify.createJsonClient({ url: 'http://127.0.0.1:8080', headers: { 'Accept':"application/json",'Content-Type':"application/json" }});
    client3.post("/list2",{ hello: 'world' },function (err,req,res,obj) {
      t.equal(res.statusCode,401,"(401) Unauthorized with route not found and no credentials specified. (OK)");
    });
    var client4 = restify.createJsonClient({ url: 'http://127.0.0.1:8080', headers: { 'Accept':"application/json",'Content-Type':"application/json" }});
    client4.post("/list/",{ hello: 'world' },function (err,req,res,obj) {
      t.equal(res.statusCode,401,"(401) Unauthorized with good route but no credentials specified. (OK)");
    });  
  });
  //
  tap.test("\nAuthentications",function (t) {
    t.plan(4);
    var client = restify.createJsonClient({ url: 'http://127.0.0.1:8080', headers: { 'Authorization':basicAuth,'Accept':"application/json",'Content-Type':"application/json" }});
    client.post("/list",{obj:'de'},function (err,req,res,obj) {
      t.equal(res.statusCode,202,"(200) With server credentials. (OK)");
    });
    var client1 = restify.createJsonClient({ url: 'http://127.0.0.1:8080', headers: { 'Authorization':'hey oh','Accept':"application/json",'Content-Type':"application/json" }});
    client1.post("/list/",{ hello: 'world' },function (err,req,res,obj) {
      t.equal(res.statusCode,401,"(401) Forbidden with invalid basic format credentials. (OK)");
    });
    var client2 = restify.createJsonClient({ url: 'http://127.0.0.1:8080', headers: { 'Authorization':'Basic c2FtcGxlOnRleHQ=','Accept':"application/json",'Content-Type':"application/json" }});
    client2.post("/list/",{ hello: 'world' },function (err,req,res,obj) {
      t.equal(res.statusCode,403,"(403) Forbidden with wrong credentials. (OK)");
    });
    var client3 = restify.createJsonClient({ url: 'http://127.0.0.1:8080', headers: { 'Authorization':basicAuth,'Accept':"application/json",'Content-Type':"application/json" }});
    client3.post("/postMessage/",{ hello: 'world' },function (err,req,res,obj) {
      t.equal(res.statusCode,200,"(200) Allow server credentials accessing client route. (OK)");
    });
  });
  //
  setTimeout(function () {
      console.log("closing server");
      process.exit(0);
  },1000);
},1000)