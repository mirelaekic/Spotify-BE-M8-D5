
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const userModel = require("./schema")

passport.use(
    "spotify",
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        callbackURL: "http://localhost:3020/users/spotify/redirect",
      },
      async function (accessToken, refreshToken, expires_in, profile, done) {
        try {
          console.log(profile)
         const user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            const newUser = {
              name: profile.displayName,
             
          
              email: profile._json.email,
            };
            const createdUser = new userModel(newUser);
            await createdUser.save();
            const token = await authenticate(createdUser);
            done(null, { user: createdUser, token });
          } else {
            const tokens = await authenticate(user);
            done(null, { user, tokens });
          } 
          done(null,profile);
        } catch (error) {
          done(error);
        }
      }
    )
  );




  passport.serializeUser(function(user,done){
    done(null,user)
  })


  module.exports = passport;