import {Request, Response} from "express";
const UserSchema = require("../models/User");

interface IMiddleWareRequest extends Request {
  user_id: number;
}

interface ITask {
  task_id: number,
  title: string,
  completed: boolean
}

interface IList {
  list_id: number,
  title: string,
  tasks?: ITask[],
  isNew?: boolean
}

class User {
  async getUser(req: IMiddleWareRequest, res: Response) {
    try {
      const user = (await UserSchema.findOne({user_id: req.user_id}))?.toObject()
      if (user) {
        // delete user.password;
        // delete user._id;
        // delete user.__v;
        return res.status(200).json(user)
      }
      return res.status(200).json({
        error: {
          code: 404,
          error_message: "User with such ID not found"
        }
      })
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'An unforeseen error occurred'})
    }
  }

  async createList(req: IMiddleWareRequest, res: Response) {
    try {
      const user_id = req.user_id
      const {title} = req.body
      console.log("title", title)
      const user = (await UserSchema.findOne({user_id}))
      const list_id = user.lists.length + 1
      user.lists.unshift({list_id, title, tasks: []})
      await user.save().then(() => console.log('Completely!'))
      return res.status(200).json({message: `List successfully created`})
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Error create list'})
    }
  }

  async addTaskById(req: IMiddleWareRequest, res: Response) {
    try {
      const user_id = req.user_id
      const {title, list_id} = req.body
      const user = (await UserSchema.findOne({user_id}))
      const count = user.lists.filter((list: IList) => list.list_id === list_id)[0].tasks.length
      const task_id = count ? count + 1 : 1
      console.log(task_id)
      user.lists = user.lists.map((list: IList) => {
        if (list.list_id == list_id) list.tasks?.push({task_id, title, completed: false})
        return list
      })
      await user.save().then(() => console.log('Completely!'))
      return res.status(200).json({message: `Task successfully added`})
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Error create task'})
    }
  }

  async editTask(req: IMiddleWareRequest, res: Response) {
    try {
      const user_id = req.user_id
      const {list_id, task_id, title, completed} = req.body
      const user = (await UserSchema.findOne({user_id}))

      user.lists = user.lists.map((list: IList) => {
        if (list.list_id === list_id) {
          list.tasks = list.tasks?.map(task => {
            if (task.task_id === task_id) {
              task.title = title
              task.completed = completed
            }
            return task
          })
        }
        return list
      })

      await user.save().then(() => console.log('Edited!'))
      return res.status(200).json({message: `Task successfully edited`})
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Error create task'})
    }
  }

  async editTitleList(req: IMiddleWareRequest, res: Response) {
    try {
      const user_id = req.user_id
      const {list_id, title} = req.body
      const user = (await UserSchema.findOne({user_id}))
      user.lists = user.lists.map((list: IList) => {
        if (list.list_id == list_id) list.title = title
        return list
      })
      await user.save().then(() => console.log('Edited title!'))
      return res.status(200).json({message: `List successfully edited`})
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Error edit list'})
    }
  }

  async deleteListById(req: IMiddleWareRequest, res: Response) {
    try {
      const user_id = req.user_id
      const {list_id} = req.body
      const user = (await UserSchema.findOne({user_id}))
      user.lists = user.lists.filter((list: IList) => list.list_id !== list_id)
      await user.save().then(() => console.log('Completely!'))
      return res.status(200).json({message: `List successfully created`})
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Error create list'})
    }
  }
}

module.exports = new User();