const express = require("express")
const UserSchema = require("./schema")
const {authenticate,refresh} = require("../auth/tool")
const  {authorize} = require("../auth/middleware")
const passport = require("passport");
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
router.get('/facebookLogin',
             
  passport.authenticate("facebook")
  
  );
 
  router.get('/facebook',
  passport.authenticate('facebook', { failureRedirect: '/register' }),
  async (req, res) => {
    try {
      console.log(req.user);
      const { token } = req.user.tokens;
      res.cookie("accessToken", token, { httpOnly: true });
      res.status(200).redirect("http://localhost:3000/home");
    } catch (error) {
      console.log(error);
    }
  });
  router.get(
    "/spotify",
    passport.authenticate("spotify", {
      scope: ["user-read-email", "user-read-private"],
    })
  );
  usersRouter.get(
    "/spotify/redirect",
    passport.authenticate("spotify"),
    async (req, res, next) => {
      try {
        res.cookie("token", req.user.token, {
          httpOnly: true,
        });
        res.status(200).redirect("https://www.youtube.com/watch?v=2ocykBzWDiM");
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
module.exports = router