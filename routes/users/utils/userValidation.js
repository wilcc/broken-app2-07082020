const { check, validationResult } = require('express-validator');

const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please Include a valid password').isLength({ min: 6 })
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please Include a valid password').isLength({ min: 6 })
];

const verifyLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    req.flash('errors', 'All inputs must be filled');
    return res.redirect('/api/users/login');
  } else {
    next();
  }
};

module.exports = { registerValidation, loginValidation, verifyLogin };
