var { ObjectId } = require('mongodb');

class PlaylistRepository {
    context;
    session;

    constructor(context, session = null) {
        this.context = context;
        this.session = session;
    }

    async findByOwner(userId) {
        return await this.context.collection("playlists").find({ owner: new ObjectId(userId) }, { session: this.session }).sort({ createdAt: -1 }).toArray();
    }

    async findByIdAndOwner(id, userId) {
        return await this.context.collection("playlists").findOne({ _id: new ObjectId(id), owner: new ObjectId(userId) }, { session: this.session });
    }

    async createPlaylist(playlist) {
        var result = await this.context.collection("playlists").insertOne(playlist, { session: this.session });
        return { ...playlist, _id: result.insertedId };
    }

    async deletePlaylist(id, userId) {
        return await this.context.collection("playlists").deleteOne({ _id: new ObjectId(id), owner: new ObjectId(userId) }, { session: this.session });
    }

    async addSong(id, userId, songId) {
        return await this.context.collection("playlists").updateOne(
            { _id: new ObjectId(id), owner: new ObjectId(userId) },
            { $addToSet: { songs: new ObjectId(songId) } },
            { session: this.session }
        );
    }

    async removeSong(id, userId, songId) {
        return await this.context.collection("playlists").updateOne(
            { _id: new ObjectId(id), owner: new ObjectId(userId) },
            { $pull: { songs: new ObjectId(songId) } },
            { session: this.session }
        );
    }
}

module.exports = PlaylistRepository;
