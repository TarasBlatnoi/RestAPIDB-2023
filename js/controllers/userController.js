'use strict'

const { User } = require('../models/Users.js')

const asyncWrapper = (callback) => {
  return async function (req, res) {
    const args = []
    try {
      if (req.params.id) {
        args.push(req.params.id)
      }
      if (req.body) {
        args.push(req.body)
      }
      const result = await callback(...args)
      if (result.length) {
        res.status(200).json({ result })
      } else {
        res.status(404).json({ errorMessage: 'No such user' })
      }
    } catch (err) {
      console.error(err)
      res.status(404).json({ errorMessage: err.message })
    }
  }
}

const getAllUsers = asyncWrapper(User.getAll)
const getUserById = asyncWrapper(User.getById)
const createUser = asyncWrapper(User.create)
const updateUser = asyncWrapper(User.updateById)
const deleteUser = asyncWrapper(User.deleteById)

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
