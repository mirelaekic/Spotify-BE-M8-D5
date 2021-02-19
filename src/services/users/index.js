const express = require("express")
const passport = require("passport");
const userModel = require("./schema")
const {authenticate,refresh} = require("../auth/tool")
const  {authorize} = require("../auth/middleware")
const router = express.Router()

router.get("/", authorize, async (req, res, next) => {
    try {
      console.log(req.user)
      const users = await userModel.find()
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
        const newUser = new userModel(req.body)
        console.log(newUser,"NEW USER")
        const {_id} = await newUser.save()
        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})
router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body
  
      const user = await userModel.findByCredentials(email, password)
      const { accessToken, refreshToken } = await authenticate(user)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        path: "/",
      })
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/users/refreshToken",
      })
  
      res.send("Ok")
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
  router.get("/refreshToken", async (req, res, next) => {
    try {
      console.log(req.cookies)
      const oldRefreshToken = req.cookies.refreshToken
      const { accessToken, refreshToken } = await refresh(oldRefreshToken)
      res.send({ accessToken, refreshToken })
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
    "/spotifyLogin",
    passport.authenticate("spotify", { scope: ["profile", "email"] })
  )
  router.get(
    "/spotifyRedirect",
    passport.authenticate("spotify"),
    async (req, res, next) => {
      try {
        res.cookie("accessToken", req.user.tokens.accessToken, {
          httpOnly: true,
        })
        res.cookie("refreshToken", req.user.tokens.refreshToken, {
          httpOnly: true,
          path: "/users/refreshToken",
        })
  
        res.status(200).redirect("http://localhost:3000/")
      } catch (error) {
        next(error)
      }
    }
  )
  router.get(
    "/googleLogin",
    passport.authenticate("google", { scope: ["profile", "email"] })
  )
  router.get(
    "/googleRedirect",
    passport.authenticate("google"),
    async (req, res, next) => {
      try {
        res.cookie("accessToken", req.user.tokens.accessToken, {
          httpOnly: true,
        })
        res.cookie("refreshToken", req.user.tokens.refreshToken, {
          httpOnly: true,
          path: "/users/refreshToken",
        })
  
        res.status(200).redirect("http://localhost:3000/")
      } catch (error) {
        next(error)
      }
    }
  )
  
module.exports = router