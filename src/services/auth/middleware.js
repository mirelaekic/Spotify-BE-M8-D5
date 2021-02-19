const {verifyAccessToken} = require("./tool")
const UserSchema = require("../users/schema")

const authorize = async (req,res,next) => {
    try {
        const token =  req.cookies.accessToken
        console.log(token,"This is the token from header")
        const decoded = await verifyAccessToken(token)
        console.log(decoded,"verifying token")
        const user = await UserSchema.findOne({_id:decoded._id})
        console.log(user,"if user is auth")
        if (!user) throw new Error()
        req.user = user
        console.log(user,"THE USER")
        req.token = token
        console.log(token,"THE TOKEN")
        next()
      } catch (error) {
        console.log(error)
        const err = new Error("Authenticate")
        err.httpStatusCode = 401
        next(err)
      }
    }

module.exports = {authorize}