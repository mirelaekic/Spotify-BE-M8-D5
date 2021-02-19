const { Schema, model } = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    name:String,
    surname:String,
    password: {
        type:String,
        required:true
    },
    email: {
        type:String,
        unique:true,
        required:true
    },
    refreshTokens: [{ token: { type: String } }],
},{timestamps:true})

UserSchema.methods.tojSON = function (){
    const user = this
    const userToObject = user.toObject()
    delete userToObject.password
    return userToObject
  }
 
  UserSchema.statics.findByCredentials = async function (email,password) {
    const user = await this.findOne({email})
    console.log(user, "THIS IS THE user")
    if(user) {
      const matches = await bcrypt.compare(password, user.password)
      console.log(matches, "CHECKING THE PASS")
      if(matches)
      return user 
      else return null
    } else {
      return null
    }
  }
 
  UserSchema.pre("save", async function (next) {
    const user = this 
    const pass = user.password
    if(user.isModified("password")){
      user.password = await bcrypt.hash(pass,10)
    }
    next()
  })

  module.exports = mongoose.model("users",UserSchema)