const express = require("express");
const cors = require("cors");
const {join} = require("path");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
const passport = require("passport")
const router = require("./services/users")
const oauth = require("./services/auth/oAuth/oAuth")

require("dotenv/config");
const {
    notFoundHandler,
    forbiddenHandler,
    badRequestHandler,
    genericErrorHandler,
  } = require("./errorHandlers")

const server = express();
const whitelist = ["http://localhost:3000","http://localhost:3001","http://localhost:3012"]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
server.use(cors(corsOptions));
const port = process.env.PORT;
const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
server.use(express.json())
server.use(cookieParser())
server.use(passport.initialize())

server.use("/users",router)

server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch(err => console.log(err))