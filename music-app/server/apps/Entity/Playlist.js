class Playlist {
    _id;
    name;
    owner; // ObjectId của user mapping
    songs; // mảng ObjectId của song
    createdAt;

    constructor() {
        this.songs = [];
        this.createdAt = new Date();
    }
}

module.exports = Playlist;
