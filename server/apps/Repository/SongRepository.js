var { ObjectId } = require('mongodb');

class SongRepository {
    context;
    session;

    constructor(context, session = null) {
        this.context = context;
        this.session = session;
    }

    async findAll() {
        return await this.context.collection("songs").find({}, { session: this.session }).sort({ createdAt: -1 }).toArray();
    }

    async findById(id) {
        return await this.context.collection("songs").findOne({ _id: new ObjectId(id) }, { session: this.session });
    }

    async search(keyword) {
        var regex = new RegExp(keyword, 'i');
        return await this.context.collection("songs").find({
            $or: [
                { title: regex },
                { artist: regex },
                { genre: regex },
                { lyrics: regex }
            ]
        }, { session: this.session }).limit(20).toArray();
    }

    async incrementPlays(id) {
        return await this.context.collection("songs").updateOne(
            { _id: new ObjectId(id) },
            { $inc: { plays: 1 } },
            { session: this.session }
        );
    }

    async findByIds(songIds) {
        var objectIds = songIds.map(id => typeof id === 'string' ? new ObjectId(id) : id);
        return await this.context.collection("songs").find({ _id: { $in: objectIds } }, { session: this.session }).toArray();
    }

    async create(song) {
        song.createdAt = new Date();
        song.plays = 0;
        var result = await this.context.collection("songs").insertOne(song, { session: this.session });
        return { ...song, _id: result.insertedId };
    }

    async update(id, updateData) {
        updateData.updatedAt = new Date();
        return await this.context.collection("songs").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { session: this.session }
        );
    }

    async delete(id) {
        return await this.context.collection("songs").deleteOne(
            { _id: new ObjectId(id) },
            { session: this.session }
        );
    }
}

module.exports = SongRepository;
