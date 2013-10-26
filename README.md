IrcMan
=============

IrcMan is a simple bridge of IRC channels on REST.

[![Build Status](https://secure.travis-ci.org/TotenDev/IrcMan.png?branch=master)](http://travis-ci.org/TotenDev/IrcMan)
[![Dependency Status](https://gemnasium.com/TotenDev/IrcMan.png)](https://gemnasium.com/TotenDev/IrcMan)

##Requirements

- [npm](https://github.com/isaacs/npm)
- [nodejs](https://github.com/joyent/node)
- [nodejs irc-js module](https://npmjs.org/package/irc-js/)
- [nodejs restify module](https://npmjs.org/package/restify)
- [nodejs mysql module](https://npmjs.org/package/mysql)
- mysql server connection

##Installing

All Stable code will be on `master` branch, any other branch is designated to unstable codes. So if you are installing for production environment, use `master` branch for better experience.

To run IrcMan you MUST have mysql server connection and [database configured](https://github.com/TotenDev/IrcMan/raw/master/create.sql). All credentials and preferences can be configured at `index.js` and are described [here](#configuration).

---

After configured your environment you can run commands below to start IrcMan:

Download and install dependencies

	$ npm install

Start server
	
	$ 'node main.js' OR 'foreman start'

##Configuration

TODO

##Rest API

####Post Message (POST)
- Method: `POST`
- URL: `example.com/postMessage/`
- Body: `my long message on body :)`
- Success codes: 
	- `200`
		
---
####List Messages (POST)
- Method: `POST`
- URL: `example.com/list`
- Body: `{"startDate":"2012-11-11","endDate":"2012-12-12"}`
- Success codes: 
	- `200` - `[{"id":25,"message":"testRest","channel":"#channel","from":"RESTSERVER","fromIP":"127.0.0.1","timeStamp":"2012-11-16T01:36:46.000Z"},{"id":26,"message":"testIrc","channel":"#channel","from":"gwdp","fromIP":"10.0.1.2","timeStamp":"2012-11-16T02:00:32.000Z"}]`

## Contributing
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
	
##License
[MIT](IrcMan/raw/master/LICENSE)
