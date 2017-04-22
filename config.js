var dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.load();

if(process.env.PRODUCTION == "true"){
    var url = "https://" + process.env.DOMAIN;
}else{
    var url = "http://" + process.env.DOMAIN;
}

module.exports = {
    "URL" : url
}