var DatabaseConnection = require('../Database/Database');
var PlaylistRepository = require('../Repository/PlaylistRepository');
var SongRepository = require('../Repository/SongRepository');
var Playlist = require('../Entity/Playlist');
var { ObjectId } = require('mongodb');

class PlaylistService {
    playlistRepository;
    songRepository;
    client;

    constructor() {
        this.client = DatabaseConnection.getMongoClient();
        this.playlistRepository = new PlaylistRepository(this.client.db());
        this.songRepository = new SongRepository(this.client.db());
    }

    async getPlaylistsByOwner(userId) {
        try {
            await this.client.connect();
            var playlists = await this.playlistRepository.findByOwner(userId);
            // Cần populate songs (lấy thông tin chi tiết bài hát)
            for (var i = 0; i < playlists.length; i++) {
                var p = playlists[i];
                if (p.songs && p.songs.length > 0) {
                    p.songs = await this.songRepository.findByIds(p.songs);
                }
            }
            return playlists;
        } finally {
            await this.client.close();
        }
    }

    async getPlaylistById(id, userId) {
        try {
            await this.client.connect();
            var playlist = await this.playlistRepository.findByIdAndOwner(id, userId);
            if (playlist && playlist.songs && playlist.songs.length > 0) {
                playlist.songs = await this.songRepository.findByIds(playlist.songs);
            }
            return playlist;
        } finally {
            await this.client.close();
        }
    }

    async createPlaylist(name, userId) {
        try {
            await this.client.connect();
            var newPlaylist = new Playlist();
            newPlaylist.name = name.trim();
            newPlaylist.owner = new ObjectId(userId);
            return await this.playlistRepository.createPlaylist(newPlaylist);
        } finally {
            await this.client.close();
        }
    }

    async deletePlaylist(id, userId) {
        try {
            await this.client.connect();
            return await this.playlistRepository.deletePlaylist(id, userId);
        } finally {
            await this.client.close();
        }
    }

    async addSongToPlaylist(playlistId, userId, songId) {
        try {
            await this.client.connect();
            var playlist = await this.playlistRepository.findByIdAndOwner(playlistId, userId);
            if (!playlist) throw new Error("Playlist not found");

            var songObjectIdStr = songId.toString();
            var songs = playlist.songs || [];
            var isExist = songs.some(s => s.toString() === songObjectIdStr);
            if (!isExist) {
                await this.playlistRepository.addSong(playlistId, userId, songId);
            }
            // Populate and return updated
            return await this.getPlaylistById(playlistId, userId);
        } finally {
            await this.client.close(); // Need to be careful because getPlaylistById opens a new connection inside finally...
            // Fix: we handled it by using finally in each method. However `finally` closes client. 
            // Calling getPlaylistById inside here will RE-OPEN and re-close. Yes, MongoDB client can do that.
        }
    }

    async removeSongFromPlaylist(playlistId, userId, songId) {
        try {
            await this.client.connect();
            await this.playlistRepository.removeSong(playlistId, userId, songId);
            return true;
        } finally {
            await this.client.close();
        }
    }
}

module.exports = PlaylistService;
