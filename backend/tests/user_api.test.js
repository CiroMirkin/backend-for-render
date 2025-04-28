const { test, beforeEach, describe } = require("node:test")
const bcrypt = require('bcrypt')
const assert = require("node:assert")
const supertest = require("supertest")

const app = require("../app")
const api = supertest(app)

const User = require('../models/user')
const { usersInDB } = require("./user_api_test_helper")

describe('When there is initially one user in DB.', () => {
    
    beforeEach(async () => {
      await User.deleteMany({})
    
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
    
      await user.save()
    })

    test('It accepts registration with new username.', async () => {
        const usersAtStart = await usersInDB()

        const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDB()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('Duplicate username attempt results in appropriate error response.', async () => {
        const usersAtStart = await usersInDB()

        const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDB()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})