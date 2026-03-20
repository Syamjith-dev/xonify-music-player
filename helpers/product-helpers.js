var db = require('../config/connection')
var collection = require('../config/collection')
const { response } = require('express')
var ObjectId = require('mongodb').ObjectId

module.exports = {
    addSongs: (songs, callback) => {
        db.get().collection(collection.PRODUCT_COLLECTION)
            .insertOne(songs)
            .then((data) => {
                callback(data.insertedId)
            })
    },
    getAllSongs: () => {
        return new Promise(async (resolve, reject) => {
            let songs = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(songs)
        })
    },
    deleteSong: (songId) => {
        return new Promise((resolve, reject) => {
            try {
                db.get()
                    .collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: new ObjectId(songId) }).then((response) => {
                        resolve(response)
                    }).catch((err) => {
                        reject(err)
                    })
            } catch (error) {
                reject(error)
            }
        })
    },
    playSong: (songId) => {

    }
}