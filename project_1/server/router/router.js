"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { check } = require('express-validator');
const router = express_1.default.Router();
const auth = require('./auth');
const user = require('./user');
const authMiddleware = require('../middleware/authMiddleware');
const just_get = (req, res) => {
    res.send(`response: ${JSON.stringify(req.query)}`);
};
router.post('/auth/registration', [
    check('username', "The username should be out of 1-15 symbols").isLength({ min: 1, max: 15 }),
    check('password', "Password should be out of 4-10 symbols").isLength({ min: 4, max: 10 })
], auth.registration);
router.post('/auth/login', auth.login);
router.get('/user', authMiddleware, user.getUser);
router.post('/user/createList', authMiddleware, user.createList);
router.post('/user/addTask', authMiddleware, user.addTaskById);
router.post('/user/editTask', authMiddleware, user.editTask);
router.post('/user/editTitleList', authMiddleware, user.editTitleList);
router.post('/user/deleteListById', authMiddleware, user.deleteListById);
exports.default = router;
