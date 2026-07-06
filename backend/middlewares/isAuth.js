import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Login again as token is not found" });
    }

    let verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    console.log(verifyToken);

    req.userId = verifyToken.id;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `isAuth error ${error}` });
  }
};

export default isAuth;