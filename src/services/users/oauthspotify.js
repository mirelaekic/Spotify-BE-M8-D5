
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;

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
          const user = await UserModel.findOne({ email: profile._json.email });
          if (!user) {
            const newUser = {
              name: profile.displayName,
             
          
              email: profile._json.email,
            };
            const createdUser = new UserModel(newUser);
            await createdUser.save();
            const token = await authenticate(createdUser);
            done(null, { user: createdUser, token });
          } else {
            const tokens = await authenticate(user);
            done(null, { user, tokens });
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );