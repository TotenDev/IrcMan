//
// index.js — IrcMan
// today is 11/15/12, it is now 08:25 PM
// created by TotenDev
// see LICENSE for details.
//


//Helpers
var IRC = require('irc-js'),
    mysqlConnector = require('mysql'),
    util = require('util');
//IrcMan
module.exports = function (options,connectedCallback) { return new IrcMan(options,connectedCallback); }
//IrcMan
function IrcMan (options,connectedCallback) {
  IrcManServerInstance = this;
  IrcManServerInstance.options = options;
  //Gobal IRC options
  IRC.options = options.irc;
  IrcManServerInstance._irc = new IRC();
  //Try to connect into irc channel
  IrcManServerInstance._irc.connect( function () {
    console.log("connecting to:",IRC.options.server,"on channel:",IRC.options.channelName);
    //'Login'
    IrcManServerInstance._irc.raw("NickServ identify",IRC.options.user.password);
    //initialize bot 
    IrcManServerInstance.joinChannel(IRC.options.channelName);
    setTimeout(connectedCallback,10000);
    
    //Start rest server
    IrcManServerInstance.restServer = require('./restServer')(options.restServer.user,options.restServer.password,function (path,body,fromIp,response) {
      if (path == '/postMessage' || path == '/postMessage/') {
        if (body && body.length > 0) {
           //Send message on IRC
           IrcManServerInstance._irc.privmsg(IrcManServerInstance.options.irc.channelName,body);
           //Archieve into db
           IrcManServerInstance.archieveNewIrcMessage(body,IrcManServerInstance.options.irc.channelName,fromIp,'RESTSERVER');
           //response
           response.send(200,{de:"de"});
        } else { response.send(202,{error:"No message on body."}); }
      }else if (path == '/list/' || path == '/list'){
        try {
          var obj = JSON.parse(body);
          if (obj["startDate"] && obj["endDate"]) {
            //
            var startRange = new Date(obj["startDate"] + " 00:00:01"),
                endRange = new Date(obj["endDate"] + " 23:59:59");
            startRange = startRange.getFullYear() + "-" + (startRange.getMonth()+1) + "-" + startRange.getDate() + " " + startRange.getHours() + ":" + startRange.getMinutes() + ":" + startRange.getSeconds() ;
            endRange = endRange.getFullYear() + "-" + (endRange.getMonth()+1) + "-" + endRange.getDate() + " " + endRange.getHours() + ":" + endRange.getMinutes() + ":" + endRange.getSeconds() ;
            //
            IrcManServerInstance.searchMessagesBetween(startRange,endRange,function (err,string) {
              if (err) { response.send(202,{error:string}); }
              else { response.send(string); }
            });
          }else { response.send(202,{error:"Missing keys on JSON."}); }
        }catch (err){ response.send(202,{error:"Processing error: "+err}); }
      }else { return false; }
      return true;
    });
//    restServer.route(req.path,req.body,res)
  });
}

/*
Private Methods
*/
//Initialize
IrcMan.prototype.joinChannel = function joinChannel(channelName) {
  IrcManServerInstance._irc.join(channelName);
  //Start PRIVMSG listner
  IrcManServerInstance._irc.addListener("*",function (command,message) {
    //auxs
    var message_string = message.params[1];
    var message_channel = message.params[0];
    //Check if is privmsg
    if (command == "privmsg") {
      //\u0001INFO\u0001 commands
      //Only from 'privmsg' message type
      var message_from_nick = message.person.nick,
                message_from_ip = message.person.host;
            message_channel = (message_channel == IRC.options.nick ? "@"+message_from_nick : message_channel);
            //Archieve into db
            IrcManServerInstance.archieveNewIrcMessage(message_string,message_channel,message_from_ip,message_from_nick);
    }
  });
}


//Database util
IrcMan.prototype.defaultDatabaseConnection = function defaultDatabaseConnection(successCb,errorCb) {
  var mysqlOptions = IrcManServerInstance.options.database;
  var connection = mysqlConnector.createConnection(mysqlOptions);
  var errorCount = 0;
  function handleDisconnect(connection) {
    connection.on('error', function(err) {
      errorCount++;
      if (errorCount >= 3) {
        connection.destroy();       

      }else {
        console.log('re-connecting lost mysql connection: '+err.stack); 
        connection = mysqlConnector.createConnection(mysqlOptions);
        handleDisconnect(connection);
        var connectionTimeout = setTimeout(function () { connection.destroy(); },10000);
        connection.connect(function(err) {
          if (err) console.log(err);
          clearTimeout(connectionTimeout);
        });
      }
    });
  }
  handleDisconnect(connection);
  var connectionTimeout = setTimeout(function () { connection.destroy(); },1000);
  connection.connect(function(err) {
    if (err) { console.log(err); errorCb(err); }
    else { successCb(connection); }
    clearTimeout(connectionTimeout);
  });
}
IrcMan.prototype.archieveNewIrcMessage = function archieveNewIrcMessage(ircMessage,channelName,fromIp,fromNickname) {
   var responsed = false;
   //create database connection for creating
   this.defaultDatabaseConnection(function (connection) {
     if (!responsed) {
      var strQuery = util.format('INSERT INTO `%s` (`id`, `message`, `channel`, `from`, `fromIP`, `timeStamp`) VALUES (NULL,\'%s\',\'%s\',\'%s\',\'%s\',CURRENT_TIMESTAMP)','messages',ircMessage,channelName,fromNickname,fromIp);
      var query = connection.query(strQuery, function(err, result) { /*console.log(result.insertId);*/ connection.destroy(); });
     }else { connection.destroy(); }
    },function (err) { console.log('internal database error ', err); });
}
IrcMan.prototype.searchMessagesBetween = function searchMessagesBetween(startDate,endDate,callback) {
   var responsed = false;
   //create database connection for creating
   this.defaultDatabaseConnection(function (connection) {
     if (!responsed) {
      var strQuery = util.format('SELECT * FROM `%s` WHERE `%s` >= \'%s\' AND `%s` <= \'%s\'','messages','timeStamp',startDate,'timeStamp',endDate);
      var query = connection.query(strQuery, function(err,result) {  callback(false,result); connection.destroy(); });
     }else { connection.destroy(); }
    },function (err) {
    //Cannot connect
    if (!responsed) { callback(true,'internal database error ', err); }
   });
}