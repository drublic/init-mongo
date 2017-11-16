import { MongoClient } from 'mongodb'

const state = {
  db: null,
  mode: null,
}

const DATABASE_URI = 'mongodb://127.0.0.1:27017/test'

exports.connect = (mode, done) => {
  if (state.db) {
    return done()
  }

  MongoClient.connect(DATABASE_URI, (err, db) => {
    if (err) {
      return done(err)
    }

    state.db = db
    state.mode = mode

    done()
  })
}

exports.getDB = () => {
  return state.db
}

exports.drop = (done) => {
  if (!state.db) {
    return done()
  }

  // This is faster then dropping the database
  state.db.collections(async (err, collections) => {

    collections.forEach((collection) => {
      await collection.remove(cb)
    })

    done()
  })
}

exports.fixtures = function (data, done) {
  var db = state.db

  if (!db) {
    return done(new Error('Missing database connection.'))
  }

  const names = Object.keys(data.collections)

  names.forEach(async (name) => {
    const collection = await db.createCollection(name, function (err, collection) {
    await collection.insert(data.collections[name], resolve)
  })

  done()
}
