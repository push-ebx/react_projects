const jwt = require('jsonwebtoken')
import {Request, Response} from "express";

const SECRET = 'fuisd783]su'

interface IMiddleWareRequest extends Request { // public
  user_id: number;
}

module.exports = function (req: IMiddleWareRequest, res: Response, next: any) { // any??
  if (req.method === "OPTIONS") {
    next()
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(200).json({
        error: {
          code: 401,
          error_message: "User has been not authorized"
        }
      })
    }
    req.user_id = jwt.verify(token, SECRET).user_id
    next()
  } catch (e) {
    console.log(e)
    return res.status(200).json({
      error: {
        code: 401,
        error_message: "User has been not authorized"
      }
    })
  }
}