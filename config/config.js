// borrowed from here: http://stackoverflow.com/questions/5778245/expressjs-how-to-structure-an-application/7350875#7350875

try {
  var dotenv = require('dotenv');
  dotenv.load();
} catch (e) {}

exports.currentEnv = process.env.NODE_ENV || 'production'

exports.appName = "voting";

// either Heroku's URL or create my own
exports.db = {URL: process.env.MONGODB_URI ||
  "mongodb://localhost:27017/"+exports.appName.toLowerCase()+"_"+exports.currentEnv}

exports.secret = process.env.SESSION_SECRET;
