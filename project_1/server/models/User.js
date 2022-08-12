"use strict";
const { Schema, model } = require('mongoose');
const Task = new Schema({
    task_id: { type: Number, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, required: true }
});
const List = new Schema({
    list_id: { type: Number, required: false },
    title: { type: String, required: false },
    tasks: { type: [Task], required: false }
});
const UserSchema = new Schema({
    user_id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    lists: { type: [List], required: false }
});
module.exports = model('User', UserSchema);
