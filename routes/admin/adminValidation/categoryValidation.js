const { validationResult } = require('express-validator');

const validateCategory = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    req.flash('errors', errors.errors[0].msg);
    return res.redirect('/api/admin/add-category');
  } else {
    return next();
  }
};

module.exports = validateCategory;
