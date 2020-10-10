var db = require('../config/connection')
var collection =require('../config/collection')
var bcrypt =require('bcrypt')
var objectId = require('mongodb').ObjectID

module.exports={
    doSignip:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            
    
            userData.Password =await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.user_collection).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            })
        })

     
        
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response={}
            let user = await db.get().collection(collection.user_collection).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                    console.log("login  success")
                    response.user =user
                    response.status= true
                    resolve(response)
                    }
                    else{
                        console.log("login failed")
                        resolve({status:false})
                    }
                })

            }
            else{
                console.log("not user")
                resolve({status:false})
                
            }
        })
    },
    getUserInfo:(user)=>{
        return new Promise(async(resolve,reject)=>{
           await db.get().collection(collection.user_collection).findOne({_id:objectId(_user)}).then((response)=>{
                resolve(response)

            })
        })
    }
   
    
}