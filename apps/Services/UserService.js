var DatabaseConnection = require('../Database/Database');
var UserRepository = require('../Repository/UserRepository');
var SongRepository = require('../Repository/SongRepository');
var User = require('../Entity/User');

class UserService {
    userRepository;
    songRepository;
    client;

    constructor() {
        this.client = DatabaseConnection.getMongoClient();
        this.userRepository = new UserRepository(this.client.db());
        this.songRepository = new SongRepository(this.client.db());
    }

    async findOrCreateFacebookUser(profile) {
        try {
            await this.client.connect();
            var user = await this.userRepository.findByFacebookId(profile.id);
            if (!user) {
                var newUser = new User();
                newUser.facebookId = profile.id;
                newUser.name = profile.displayName;
                newUser.email = profile.emails ? profile.emails[0].value : "";
                newUser.avatar = profile.photos ? profile.photos[0].value : "";
                user = await this.userRepository.createUser(newUser);
            }
            return user;
        } finally {
            await this.client.close();
        }
    }

    async registerLocalUser(name, email, password) {
        try {
            await this.client.connect();
            var existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('Email already exists');
            }
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            var newUser = new User();
            newUser.name = name;
            newUser.email = email;
            newUser.password = hashedPassword;
            newUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1db954&color=fff`;

            return await this.userRepository.createUser(newUser);
        } finally {
            await this.client.close();
        }
    }

    async verifyLocalUser(email, password) {
        try {
            await this.client.connect();
            var user = await this.userRepository.findByEmail(email);
            if (!user) {
                return false;
            }
            if (!user.password) {
                return false; // Khách hàng đăng ký bằng Facebook
            }
            const bcrypt = require('bcryptjs');
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return false;
            }
            return user;
        } finally {
            await this.client.close();
        }
    }

    async findById(id) {
        try {
            await this.client.connect();
            return await this.userRepository.findById(id);
        } finally {
            await this.client.close();
        }
    }

    async getAllUsers() {
        try {
            await this.client.connect();
            return await this.userRepository.getAllUsers();
        } finally {
            await this.client.close();
        }
    }

    async updateUserRole(id, role) {
        try {
            await this.client.connect();
            return await this.userRepository.updateRole(id, role);
        } finally {
            await this.client.close();
        }
    }

    async deleteUser(id) {
        try {
            await this.client.connect();
            return await this.userRepository.deleteUser(id);
        } finally {
            await this.client.close();
        }
    }

    async addFavorite(userId, songId) {
        try {
            await this.client.connect();
            var user = await this.userRepository.findById(userId);
            // Kiểm tra xem đã có chưa
            var favorites = user.favorites || [];
            var songObjectIdStr = songId.toString();
            var isExist = favorites.some(fav => fav.toString() === songObjectIdStr);
            if (!isExist) {
                await this.userRepository.addFavorite(userId, songId);
            }
            return true;
        } finally {
            await this.client.close();
        }
    }

    async removeFavorite(userId, songId) {
        try {
            await this.client.connect();
            await this.userRepository.removeFavorite(userId, songId);
            return true;
        } finally {
            await this.client.close();
        }
    }

    async getFavorites(userId) {
        try {
            await this.client.connect();
            var user = await this.userRepository.findById(userId);
            var favorites = user.favorites || [];
            if (favorites.length === 0) return [];
            
            // Tìm chi tiết bài hát từ SongRepository
            return await this.songRepository.findByIds(favorites);
        } finally {
            await this.client.close();
        }
    }
}

module.exports = UserService;
