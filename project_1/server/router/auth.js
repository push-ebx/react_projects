"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { validationResult } = require("express-validator");
const UserSchema = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET = 'fuisd783]su';
const generateAccessToken = (user_id) => {
    const payload = {
        user_id
    };
    return jwt.sign(payload, SECRET, { expiresIn: "365d" });
};
class Auth {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(200).json({
                        error: {
                            code: 422,
                            error_message: { errors }
                        }
                    });
                }
                const { username, password } = req.body;
                const candidate = yield UserSchema.findOne({ username });
                if (candidate) {
                    return res.status(200).json({
                        error: {
                            code: 421,
                            error_message: "The user has already been created"
                        }
                    });
                }
                const count = yield UserSchema.countDocuments();
                const hashPassword = bcrypt.hashSync(password, 7);
                const user = new UserSchema({
                    user_id: count + 1,
                    username,
                    password: hashPassword,
                    lists: []
                });
                const token = generateAccessToken(user.user_id);
                yield user.save().then(() => console.log(`User successfully registered with id: ${count + 1}`));
                res.status(200).json({ message: `User successfully registered with id: ${count + 1}`, token });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Registration error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const user = yield UserSchema.findOne({ username });
                if (!user) {
                    return res.status(200).json({
                        error: {
                            code: 404,
                            error_message: "User not found"
                        }
                    });
                }
                const validPassword = bcrypt.compareSync(password, user.password);
                if (!validPassword) {
                    return res.status(200).json({
                        error: {
                            code: 422,
                            error_message: "Entered invalid password"
                        }
                    });
                }
                const token = generateAccessToken(user.user_id);
                return res.json({
                    token,
                    user_id: user.user_id
                });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'LoginPage error' });
            }
        });
    }
}
module.exports = new Auth();
