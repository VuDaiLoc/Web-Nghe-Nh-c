var DatabaseConnection = require('../Database/Database');
var SongRepository = require('../Repository/SongRepository');

class SongService {
    songRepository;
    client;

    constructor() {
        this.client = DatabaseConnection.getMongoClient();
        this.songRepository = new SongRepository(this.client.db());
    }

    async getAllSongs() {
        try {
            await this.client.connect();
            return await this.songRepository.findAll();
        } finally {
            await this.client.close();
        }
    }

    async searchSongs(keyword) {
        if (!keyword || keyword.trim() === '') {
            return [];
        }
        try {
            await this.client.connect();
            return await this.songRepository.search(keyword);
        } finally {
            await this.client.close();
        }
    }

    async getSongById(id) {
        try {
            await this.client.connect();
            var song = await this.songRepository.findById(id);
            if (song) {
                await this.songRepository.incrementPlays(id);
            }
            return song;
        } finally {
            await this.client.close();
        }
    }

    async createSong(songData) {
        try {
            await this.client.connect();
            return await this.songRepository.create(songData);
        } finally {
            await this.client.close();
        }
    }

    async updateSong(id, updateData) {
        try {
            await this.client.connect();
            return await this.songRepository.update(id, updateData);
        } finally {
            await this.client.close();
        }
    }

    async deleteSong(id) {
        try {
            await this.client.connect();
            // Optional: Remove song from all users' favorites and playlists before deleting
            return await this.songRepository.delete(id);
        } finally {
            await this.client.close();
        }
    }
}

module.exports = SongService;
