var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { ObjectId } = require('mongodb')
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId);
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("login success")
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login failed")
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("no account existed")
                resolve({ status: false })
            }
        })
    },
    addToLiked: (songId, userId) => {
        return new Promise(async (resolve, reject) => {

            let userLikes = await db.get().collection(collection.LIKED_COLLECTION)
                .findOne({ user: new ObjectId(userId) })

            if (userLikes) {

                db.get().collection(collection.LIKED_COLLECTION).updateOne(
                    { user: new ObjectId(userId) },
                    {
                        $addToSet: { likes: new ObjectId(songId) }
                    }
                ).then(() => {
                    resolve()
                })

            } else {

                let likeObj = {
                    user: new ObjectId(userId),
                    likes: [new ObjectId(songId)]
                }

                db.get().collection(collection.LIKED_COLLECTION)
                    .insertOne(likeObj).then(() => {
                        resolve()
                    })

            }
        })
    },

    getLikedSongs: (userId) => {
        return new Promise(async (resolve, reject) => {

            let likedSongsItems = await db.get().collection(collection.LIKED_COLLECTION).aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        let: { likeList: '$likes' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$likeList']
                                    }
                                }
                            }
                        ],
                        as: 'likedItems'
                    }
                }
            ]).toArray()

            if (likedSongsItems.length > 0) {
                resolve(likedSongsItems[0].likedItems)
            } else {
                resolve([])
            }

        })
    }
}