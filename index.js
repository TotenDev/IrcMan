//
// index.js — IrcMan
// today is 11/15/12, it is now 08:25 PM
// created by TotenDev
// see LICENSE for details.
//


//Helpers
var defaultIRCNick = "botNickname";
var server = require('./lib/server.js')({ 
      irc: {
          port:6667,
          encoding:'utf8',
          nick:defaultIRCNick,
          log:false,
          die:false,
          flood_protection: false,
          server:"chat.freenode.net",
          channelName:"#totendev",
          user: { username:defaultIRCNick,servername:defaultIRCNick,realname:defaultIRCNick,password:"" }
       },
      database: {
        host:"localhost",
        user:"root",
        password:"root",
        database:"ircMan",
        port:8889,
        debug:false
       },
      restServer: {
        user:'testUser',
        password:'testPassword'
      }
    },function () {
      console.log("UP");
    });