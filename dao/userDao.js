const User = require('../models/user');
const connect = require('../services/db');

class MongoUserDao {
    async getUsers() {
        await connect();

        return await User.find();
    }

    async getUser(username) {
        await connect();

        return await User.findOne({name: username});
    }

    async getUserById(id) {
        await connect();

        return await User.findById(id);
    }

    async getUserByEmail(email) {
        await connect();

        return await User.findOne({email: email});
    }

    async addUser(user) {
        await connect();

        const newUser = new User(user);
        await newUser.save();

        return newUser;
    }

    async updateUser(userId, updatedUser) {
        await connect();

        return await User.findByIdAndUpdate(userId, updatedUser);
    }

    async deleteUser(userId) {
        await connect();

        return await User.findByIdAndDelete(userId);
    }
};

module.exports = new MongoUserDao();
