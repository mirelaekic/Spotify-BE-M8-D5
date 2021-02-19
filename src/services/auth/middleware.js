const {verifyJWT} = require("./tool")
const user = require("../users/schema")
const authorize = async (req,res,next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = await verifyJWT(token)
        const AuthorizedUser = await user.findOne({_id:decoded._id})
        if(!AuthorizedUser){
            throw new Error()
        }
        req.token = token
        req.user = AuthorizedUser
        next()
    } catch (error) {
        const err = new Error("You have to authenticate!")
        err.httpStatusCode = 401
        next(err)
    }
}

module.exports = {authorize}