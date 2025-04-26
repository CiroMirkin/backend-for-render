const { test, after, beforeEach, describe } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")

const app = require("../app")
const api = supertest(app)

const Note = require("../models/note")
const { initialNotes, getNotesFromDB, getNonExistingId } = require("./test_helper")

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = initialNotes.map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

describe('Get notes correctly', () => {
  test("Notes are returned as JSON.", async () => {
    // An HTTP GET request is made to the URL api/notes and verifies that the request is responded to with status code 200. The test also verifies that the Content-Type header is set to application/json, indicating that the data is in the desired format.
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
    assert(contents.includes("I love drink"))
  })

  describe('Get a specific note.', () => {
    test("It succeeds with a valid ID.", async () => {
      const notesAtStart = await getNotesFromDB()
      const noteToView = notesAtStart[0]
      
      const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  
      assert.deepStrictEqual(resultNote.body, noteToView) // Verify that the attributes and their values are the same.
    })

    test('If the note doesnt exist fails with statuscode 404.', async () => {
      const NonExistingNoteId = await getNonExistingId()
      await api
        .get(`/api/notes/${NonExistingNoteId}`)
        .expect(404)
    })

    test('Fails with statuscode 400 if the note ID is invalid.', async () => {
      const invalidNoteId = '5a3d5da59070081a82a3445'
      await api
      .get(`/api/notes/${invalidNoteId}`)
      .expect(400)
    })
  })
})

describe('Create a new note.', () => {
  test("A valid note can be created.", async () => {
    const newNote = {
      content: "coffee",
    }
    
    await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/)
    
    const notesAtEnd = await getNotesFromDB()
    assert.strictEqual(notesAtEnd.length, initialNotes.length + 1)
    const contents = notesAtEnd.map((n) => n.content)
    assert(contents.includes("coffee"))
  })

  test("An empty note can not be created.", async () => {
    const newNote = {
      content: ""
    }
  
    await api.post("/api/notes").send(newNote).expect(400)
  
    const response = await getNotesFromDB()
    assert.strictEqual(response.length, initialNotes.length)
  })
})

test("A note can be deleted.", async () => {
  const notesAtStart = await getNotesFromDB()
  const noteToDelete = notesAtStart[0]

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

  const notesAtEnd = await getNotesFromDB()
  const contents = notesAtEnd.map((r) => r.content)
  assert(!contents.includes(noteToDelete.content))

  assert.strictEqual(notesAtEnd.length, initialNotes.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
