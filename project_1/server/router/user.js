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
const UserSchema = require("../models/User");
class User {
    getUser(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (_a = (yield UserSchema.findOne({ user_id: req.user_id }))) === null || _a === void 0 ? void 0 : _a.toObject();
                if (user) {
                    // delete user.password;
                    // delete user._id;
                    // delete user.__v;
                    return res.status(200).json(user);
                }
                return res.status(200).json({
                    error: {
                        code: 404,
                        error_message: "User with such ID not found"
                    }
                });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'An unforeseen error occurred' });
            }
        });
    }
    createList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.user_id;
                const { title } = req.body;
                console.log("title", title);
                const user = (yield UserSchema.findOne({ user_id }));
                const list_id = user.lists.length + 1;
                user.lists.unshift({ list_id, title, tasks: [] });
                yield user.save().then(() => console.log('Completely!'));
                return res.status(200).json({ message: `List successfully created` });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Error create list' });
            }
        });
    }
    addTaskById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.user_id;
                const { title, list_id } = req.body;
                const user = (yield UserSchema.findOne({ user_id }));
                const count = user.lists.filter((list) => list.list_id === list_id)[0].tasks.length;
                const task_id = count ? count + 1 : 1;
                console.log(task_id);
                user.lists = user.lists.map((list) => {
                    var _a;
                    if (list.list_id == list_id)
                        (_a = list.tasks) === null || _a === void 0 ? void 0 : _a.push({ task_id, title, completed: false });
                    return list;
                });
                yield user.save().then(() => console.log('Completely!'));
                return res.status(200).json({ message: `Task successfully added` });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Error create task' });
            }
        });
    }
    editTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.user_id;
                const { list_id, task_id, title, completed } = req.body;
                const user = (yield UserSchema.findOne({ user_id }));
                user.lists = user.lists.map((list) => {
                    var _a;
                    if (list.list_id === list_id) {
                        list.tasks = (_a = list.tasks) === null || _a === void 0 ? void 0 : _a.map(task => {
                            if (task.task_id === task_id) {
                                task.title = title;
                                task.completed = completed;
                            }
                            return task;
                        });
                    }
                    return list;
                });
                yield user.save().then(() => console.log('Edited!'));
                return res.status(200).json({ message: `Task successfully edited` });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Error create task' });
            }
        });
    }
    editTitleList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.user_id;
                const { list_id, title } = req.body;
                const user = (yield UserSchema.findOne({ user_id }));
                user.lists = user.lists.map((list) => {
                    if (list.list_id == list_id)
                        list.title = title;
                    return list;
                });
                yield user.save().then(() => console.log('Edited title!'));
                return res.status(200).json({ message: `List successfully edited` });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Error edit list' });
            }
        });
    }
    deleteListById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.user_id;
                const { list_id } = req.body;
                const user = (yield UserSchema.findOne({ user_id }));
                user.lists = user.lists.filter((list) => list.list_id !== list_id);
                yield user.save().then(() => console.log('Completely!'));
                return res.status(200).json({ message: `List successfully created` });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Error create list' });
            }
        });
    }
}
module.exports = new User();
