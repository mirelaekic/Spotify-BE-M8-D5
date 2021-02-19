const express = require("express")
const UserSchema = require("./schema")
const {authenticate} = require("../auth/tool")
const  {authorize} = require("../auth/middleware")
const router = express.Router()

router.get("/", authorize, async (req, res, next) => {
    try {
      console.log(req.user)
      const users = await UserSchema.find()
      res.send(users)
    } catch (error) {
      next(error)
    }
  })
router.get("/me",authorize,async (req,res,next) => {
    try {
        console.log(req.user,"USER")
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})
router.post("/register",async (req,res,next) => {
    try {
        const newUser = new UserSchema(req.body)
        console.log(newUser,"NEW USER")
        const {_id} = await newUser.save()
        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})
router.post("/login", async(req,res,next) => {
    try {
        const {email,password} = req.body
        const user = await UserSchema.findByCredentials(email,password)
        const tokens = await authenticate(user)
        res.send(tokens)
    } catch (error) {
        next(error)
    }
})
router.put("/me",authorize, async (req, res, next) => {
    try {
      const updates = Object.keys(req.body)
      updates.forEach(update => (req.user[update] = req.body[update]))
      await req.user.save()
      res.send(req.user)
    } catch (error) {
      next(error)
    }
  })
module.exports = router