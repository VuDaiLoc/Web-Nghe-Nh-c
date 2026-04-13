class User {
    _id;
    facebookId;
    name;
    email;
    password;
    avatar;
    role;
    favorites;
    createdAt;

    constructor() {
        this.role = 'user';
        this.favorites = [];
        this.createdAt = new Date();
    }
}

module.exports = User;
