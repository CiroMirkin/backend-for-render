const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require("mongoose")
const supertest = require("supertest")

const app = require("../app")
const api = supertest(app)

const Note = require('../models/note')
const initialNotes = [
  {
    content: 'I love drink',
    important: false,
  },
  {
    content: 'Browser can execute only JS',
    important: true,
  },
]

beforeEach(async () => {
    await Note.deleteMany({})

    let noteObject = new Note(initialNotes[0])
    await noteObject.save()
    
    noteObject = new Note(initialNotes[1])
    await noteObject.save()
})

// An HTTP GET request is made to the URL api/notes and verifies that the request is responded to with status code 200. The test also verifies that the Content-Type header is set to application/json, indicating that the data is in the desired format.

test("Notes are returned as JSON.", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("There are two notes.", async () => {
  const response = await api.get("/api/notes")

  assert.strictEqual(response.body.length, initialNotes.length)
})

test("The first note is 'I love drink'.", async () => {
  const response = await api.get("/api/notes")

  const contents = response.body.map((e) => e.content)
  assert(contents.includes('I love drink'))
})

after(async () => {
  await mongoose.connection.close()
})
