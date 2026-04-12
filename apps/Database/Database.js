var config = require(global.__basedir + "/Config/Setting.json");

class DatabaseConnection {
    url;
    user;
    pass;

    constructor() {}

    static getMongoClient() {
        this.user = config.mongodb.username;
        this.pass = config.mongodb.password;
        
        // Chỉnh sửa URL kết nối localhost
        this.url = "mongodb://127.0.0.1:27017/" + config.mongodb.database + "?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000";
        
        var { MongoClient } = require('mongodb');
        var client = new MongoClient(this.url);
        return client;
    }
}

module.exports = DatabaseConnection;
