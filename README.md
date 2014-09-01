#YouWill Admin Portal
##Guide for Deployment
###Things you need to install before deployment
####1. install [NodeJs](http://nodejs.org/)
####2. install bower locally
`npm install -g bower`
####3. install forever locally
`npm install -g forever`
####4. install dependencies
`cd` to the directory of this project folder and run `npm install`
####5. add KiiSDK
manually put `KiiSDK.js` into `./app/bower_components/KiiSDK/`
### Deploy the project
`forever start app.js`, to change the port number: edit `./app.js`
### Stop the project
`forever stop app.js`
### More
see this [link](https://github.com/nodejitsu/forever)
