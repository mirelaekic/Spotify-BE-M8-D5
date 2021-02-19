const express = require("express")
const UserSchema = require("./schema")
const router = express.Router()

router.get("/",async (req,res,next) => {
    try {
        
    } catch (error) {
        
    }
})
router.get("/:id",async (req,res,next) => {
    try {
        
    } catch (error) {
        
    }
})
router.get("/me",async (req,res,next) => {
    try {
        
    } catch (error) {
        
    }
})
router.post("/register",async (req,res,next) => {
    try {
        const newUser = new UserSchema(req.body)
        const {_id} = await newUser.save()
        res.status(201).send(_id)
    } catch (error) {
        
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