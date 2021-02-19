const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;

const userModel = require("./schema");
const jwt = require("jsonwebtoken");

const authenticate = async (user) => {
    try {
      // generate tokens
      const newAccessToken = await jwt.sign(
        { id: user._id },
        process.env.SECRET_KEY,
        {
          expiresIn: "15m",
        }
      );
  
      return { token: newAccessToken };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };


passport.use(
    
    
    new facebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET ,
    callbackURL: "http://localhost:3020/users/facebook/",
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name'],
    enableProof: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    const newUser = {
      facebookId: profile.id,
      name: profile.name.givenName,
      surname: profile.name.familyName,
      email: profile.emails[0].value,
      username: profile.username
    };
    
    console.log(profile)
    try {
      const user = await userModel.findOne({ facebookId: profile.id });

      if (user) {
        const tokens = await authenticate(user);
        done(null, { user, tokens });
      } else {
        let createdUser = await userModel.create(newUser);
        const tokens = await authenticate(createdUser);
        done(null, { user, tokens });
      }
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});
  
passport.deserializeUser(function (user, done) {
    done(null, user);
});
  