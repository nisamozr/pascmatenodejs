var db = require('../config/connection')
var collection = require('../config/collection')
var bcrypt = require('bcrypt')
const { use } = require('../routes')
var objectId = require('mongodb').ObjectID
const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const { head } = require('../app')
const { promises } = require('dns')



module.exports = {
    doSignip: (userData) => {
        return new Promise(async (resolve, reject) => {


            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.user_collection).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })
        })



    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.user_collection).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("login  success")
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else {
                        console.log("login failed")
                        resolve({ status: false })
                    }
                })

            }
            else {
                console.log("not user")
                resolve({ status: false })

            }
        })
    },
    updateUserInfo: (userId, userdata) => {

        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.user_collection).update({ _id: objectId(userId) },
                {
                    $set:
                    {
                        Fulname: userdata.Fulname,
                        Username: userdata.Username,
                        Phone: userdata.Phone,
                        dob: userdata.dob,
                        City: userdata.City,
                        Country: userdata.Country,
                        Aboutme: userdata.Aboutme

                    }
                }).then((response) => {
                    resolve(response)

                })
        })

    },
    updateEducation: (userId, userdata) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.user_collection).update({ _id: objectId(userId) },
                {
                    $set:
                    {
                        Education: [userdata.Collegename, userdata.Course, userdata.Educationstatus]
                    }
                }).then((response) => {
                    resolve(response)

                })
        })


    },
    InsertIntrest: (userId, userdata) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.user_collection).update({ _id: objectId(userId) },
                {
                    $push: {
                        Intresrt: [userdata.Interste]
                    }
                }).then((response) => {
                    resolve(response)

                })
        })




    },
    deleteINtrest: (userId, intres) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.user_collection).update({ _id: objectId(userId) },
                { $pull: { Intresrt: { $in: [intres] } } }
            ).then((response) => {
                resolve(response)

            })
        })

    },
    // PasswordChance:(userId,userData)=>{
    //     return new Promise(async(resolve,reject)=>{

    //         var Password = userData.Password
    //         bcrypt.hash(Password, (hash) => {
    //             userData.Password = hash
    //             await db.get().collection(collection.user_collection).update({_id:objectId(userId)},
    //         {$set:
    //        {
    //            Password:userdata.Password
    //        }
    //      }).then((response)=>{
    //         resolve(response)
    //      })


    //         })

    //     })

    // }

    uploadeDp: (userId, userData) => {

        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.user_collection).update({ _id: objectId(userId) },
                {
                    $set:
                    {
                        coverPhoto: userData.coverPhoto
                    }
                }).then((response) => {
                    console.log(response)
                    resolve(response)

                })
        })


    },
    addPost: (userid, userPost, postimage, videoname) => {

        let hell = {
            Caption: userPost.caption,
            image: postimage,
            video: videoname,
            PostAt: new Date(),
            Likes: [],
            Comments: [],
           
            user: {
                _id: userid._id,
                name: userid.Fulname
            }
        }
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_POST).insertOne(hell, function (error, data) {

                db.get().collection(collection.user_collection).updateOne({ _id: objectId(userid._id) },
                    {
                        $push: {
                            "post": {
                                "_id": data.insertedId,
                                "Caption": userPost.caption,
                                "image": postimage,
                                "video": videoname,
                                "PostAt": new Date(),
                                "Likes": [],
                                "Comments": [],
                               

                            }
                        }
                        
                    }
                   
                    )

            }).then((response) => {
                console.log(response)
                resolve(response)

            })
           
        })

    },
    getUserPost: (userId) => {

        return new Promise(async (resolve, reject) => {
          let posts =  await db.get().collection(collection.user_collection).find({ _id: objectId(userId) }
                ).sort({post[0].PostAt: -1}).toArray()
                resolve(posts[0].post)
        })


    },
    homePost:(userId)=>{
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.user_collection).findOne({_id:objectId(userId)},(err,user)=>{
                if (user == null){
                    result.json({
                        "status":"error",
                        "message":"User has been logged out.Pleacse login"
                    })
                }else{
                    var ids = []
                    ids.push(user._id)
                 db.get().collection(collection.USER_POST).find({"user._id":{$in:ids}  }
                        ).sort({"createdAt":-1}).toArray((error,data)=>{
                            result.json({
                                "status":"success",
                                "message":"Record has been feched",
                                "data":data
                            })
                        })

                }
            })
        //    .then((response) => {
        //             console.log(response)
        //             resolve(response)

        //         })
        })

    },
   



}