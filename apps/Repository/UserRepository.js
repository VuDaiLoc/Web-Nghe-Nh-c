var { ObjectId } = require('mongodb');

class UserRepository {
    context;
    session;

    constructor(context, session = null) {
        this.context = context;
        this.session = session;
    }

    async findByFacebookId(facebookId) {
        return await this.context.collection("users").findOne({ facebookId: facebookId }, { session: this.session });
    }

    async findByEmail(email) {
        return await this.context.collection("users").findOne({ email: email }, { session: this.session });
    }

    async findById(id) {
        return await this.context.collection("users").findOne({ _id: new ObjectId(id) }, { session: this.session });
    }

    async createUser(user) {
        var result = await this.context.collection("users").insertOne(user, { session: this.session });
        return { ...user, _id: result.insertedId };
    }

    async getAllUsers() {
        return await this.context.collection("users").find({}, { session: this.session }).sort({ createdAt: -1 }).toArray();
    }

    async updateRole(id, role) {
        return await this.context.collection("users").updateOne(
            { _id: new ObjectId(id) },
            { $set: { role: role } },
            { session: this.session }
        );
    }

    async deleteUser(id) {
        return await this.context.collection("users").deleteOne(
            { _id: new ObjectId(id) },
            { session: this.session }
        );
    }

    async addFavorite(userId, songId) {
        return await this.context.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { favorites: new ObjectId(songId) } },
            { session: this.session }
        );
    }

    async removeFavorite(userId, songId) {
        return await this.context.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { favorites: new ObjectId(songId) } },
            { session: this.session }
        );
    }
}

module.exports = UserRepository;
