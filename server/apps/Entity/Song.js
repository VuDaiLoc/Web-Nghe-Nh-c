class Song {
    _id;
    title;
    artist;
    genre;
    lyrics;
    audioUrl;
    coverUrl;
    duration;
    plays;
    createdAt;

    constructor() {
        this.plays = 0;
        this.createdAt = new Date();
    }
}

module.exports = Song;
