const jwt = require("jsonwebtoken");
const user = require("../users/schema");

const authenticate = async (user) => {
  try {
    const newToken = await generateJWT({ _id: user._id });
    const newRefreshToken = await generateRefreshJWT({ _id: user._id });

    user.refreshTokens = user.refreshTokens.concat({
      token: newRefreshToken,
    });
    await user.save();
    return { token: newToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error(error);
    console.log(error);
  }
};

const generateJWT = (playload) =>
  new Promise((res, rej) =>
    jwt.sign(
      playload,
      process.env.JWT_SECRET,
      { expiresIn: 5 },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyJWT = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const generateRefreshJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyRefreshToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );
const refreshToken = async (oldRefreshToken) => {
  const decoded = await verifyRefreshToken(oldRefreshToken);

  const findUser = await user.findOne({ _id: decoded._id });

  if (!findUser) {
    throw new Error(`Access is forbidden`);
  }
  const currentRefreshToken = user.refreshTokens.find(
    (t) => t.token === oldRefreshToken
  );

  if (!currentRefreshToken) {
    throw new Error(`Refresh token is wrong`);
  }

  const newAccessToken = await generateJWT({ _id: user._id });
  const newRefreshToken = await generateRefreshJWT({ _id: user._id });

  const newRefreshTokens = user.refreshTokens
    .filter((t) => t.token !== oldRefreshToken)
    .concat({ token: newRefreshToken });

  user.refreshTokens = [...newRefreshTokens];

  await user.save();

  return { token: newAccessToken, refreshToken: newRefreshToken };
};
module.exports = { authenticate, verifyJWT, refreshToken };