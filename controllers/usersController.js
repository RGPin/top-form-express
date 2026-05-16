const usersStorage = require("../storages/usersStorage");
const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First Name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First Name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last Name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last Name ${lengthErr}`),
  body("email").trim().isEmail().withMessage("Enter valid email"),
  body("age")
    .optional({ values: "falsy" })
    .trim()
    .isNumeric()
    .withMessage("Invalid age"),
  body("bio")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Invalid bio. 200 char max"),
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", { title: "Create user" });
};

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = matchedData(req, {
      includeOptionals: true,
    });
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    const user = usersStorage.getUser(req.params.id);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        errors: errors.array(),
        user,
      });
    }
    const { firstName, lastName } = matchedData(req);
    usersStorage.updateUser(req.params.id, { firstName, lastName });
    res.redirect("/");
  },
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};
