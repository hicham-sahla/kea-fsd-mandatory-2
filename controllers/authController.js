const User = require("../models/User");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: maxAge,
  });
};

// controller actions
const signup_get = (req, res) => {
  res.render("auth/signup");
};

const login_get = (req, res) => {
  res.render("auth/login");
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });

    // Emit a custom event to the client indicating the signup success
    const io = req.app.get("io"); // Access the `io` instance from the app
    if (io) {
      io.to(user._id).emit("signupSuccess", { user: user._id });
    } else {
      console.error("Socket.io is not initialized.");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });

    const io = req.app.get("io"); // Access the `io` instance from the app
    if (io) {
      io.to(user._id).emit("signupFailure", { error: errors.email });
    } else {
      console.error("Socket.io is not initialized.");
    }
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });

    const io = res.locals.io; // Access the `io` instance from res.locals
    io.emit("loginSuccess", { user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });

    const io = res.locals.io;
    io.emit("loginFailure", { error: errors.email });
  }
};

const user_like_post = (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, "secret", async (err, decodedToken) => {
    if (err) console.log(err); // eg. invalid token, or expired token
    let user = await User.findById(decodedToken.id);
    const newLike = req.body.serieId;
    const filter = { _id: user.id };
    const update = { likes: user.likes };
    if (!user.likes) {
      user.likes = [];
    }

    user.likes.push(newLike); // push is undefined want bovenstaande zijn niet beschikbaar
    User.findOneAndUpdate(filter, update).then(() => res.redirect("/series"));
  });
};

const user_dislike_post = (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, "secret", async (err, decodedToken) => {
    if (err) console.log(err); // eg. invalid token, or expired token
    let user = await User.findById(decodedToken.id);
    const newLike = req.body.serieId;
    const filter = { _id: user.id };
    if (!user.likes) {
      user.likes = [];
    }
    const filteredLikesList = user.likes.filter((like) => {
      return like !== newLike;
    });
    const update = { likes: filteredLikesList };
    User.findOneAndUpdate(filter, update).then(() => {
      res.redirect("/series");
    });
  });
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");

  const io = req.app.get("io"); // Access the `io` instance from the app
  io.to(req.user._id).emit("logout");
};

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  user_like_post,
  user_dislike_post,
  logout_get,
};
