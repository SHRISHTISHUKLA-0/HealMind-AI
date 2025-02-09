const userService = require('../services/userService');
const { userSchema } = require('../validation/schemas');
const logger = require('../utils/monitoring').logger;

class UserController {
    async register(req, res, next) {
        try {
            const { error } = userSchema.validate(req.body);
            if (error) {
                throw { status: 400, message: error.details[0].message };
            }

            const result = await userService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw { status: 400, message: 'Email and password are required' };
            }

            const result = await userService.login({ email, password });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const updatedUser = await userService.updateProfile(userId, req.body);
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await userService.getProfile(userId);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async deleteAccount(req, res, next) {
        try {
            const userId = req.user.id;
            await userService.deleteAccount(userId);
            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
