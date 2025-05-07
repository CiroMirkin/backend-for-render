const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
 
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  
  // The token will expire in one day
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: '1d' }
  )

  const savedUser = await user.save() 

  response.status(201).json({...savedUser, token}) // 201 is the HTTP successful created code
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', { content: 1 }) // Get only content property
    response.json(users)
})

module.exports = usersRouter