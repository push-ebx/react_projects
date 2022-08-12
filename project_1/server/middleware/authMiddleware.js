"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const SECRET = 'fuisd783]su';
module.exports = function (req, res, next) {
    var _a;
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(200).json({
                error: {
                    code: 401,
                    error_message: "User has been not authorized"
                }
            });
        }
        req.user_id = jwt.verify(token, SECRET).user_id;
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            error: {
                code: 401,
                error_message: "User has been not authorized"
            }
        });
    }
};
