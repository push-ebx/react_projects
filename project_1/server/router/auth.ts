import {Request, Response} from "express";
const {validationResult} = require("express-validator");
const UserSchema = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const SECRET = 'fuisd783]su'

const generateAccessToken = (user_id: number) => {
  const payload = {
    user_id
  }
  return jwt.sign(payload, SECRET, {expiresIn: "365d"})
}

class Auth {
  async registration(req: Request, res: Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(200).json({
          error: {
            code: 422,
            error_message: {errors}
          }
        })
      }
      const {username, password} = req.body
      const candidate = await UserSchema.findOne({username})
      if (candidate) {
        return res.status(200).json({
          error: {
            code: 421,
            error_message: "The user has already been created"
          }
        })
      }

      const count = await UserSchema.countDocuments();
      const hashPassword = bcrypt.hashSync(password, 7)

      const user = new UserSchema({
        user_id: count + 1,
        username,
        password: hashPassword,
        lists: []
      });
      const token = generateAccessToken(user.user_id)
      await user.save().then(() => console.log(`User successfully registered with id: ${count + 1}`));
      res.status(200).json({message: `User successfully registered with id: ${count + 1}`, token})
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Registration error'})
    }
  }

  async login(req: Request, res: Response) {
    try {
      const {username, password} = req.body
      const user = await UserSchema.findOne({username})
      if (!user) {
        return res.status(200).json({
          error: {
            code: 404,
            error_message: "User not found"
          }
        })
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(200).json({
          error: {
            code: 422,
            error_message: "Entered invalid password"
          }
        })
      }
      const token = generateAccessToken(user.user_id)
      return res.json({
        token,
        user_id: user.user_id
      })
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'LoginPage error'})
    }
  }
}

module.exports = new Auth();