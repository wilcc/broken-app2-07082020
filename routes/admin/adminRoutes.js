const router = require('express').Router();

const { validationResult } = require('express-validator');
const { waterfall } = require('async');
const faker = require('faker');

const Product = require('./products/models/Product');
const Category = require('./categories/models/Category');
const checkCategory = require('./categories/utils/checkCategory');


router.get('/add-category', (req, res, next) => {
  return res.render('admin/add-category');
});

router.post('/add-category', checkCategory,(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    req.flash('errors', errors.errors[0].msg);
    return res.redirect('/api/admin/add-category');
  }

  const category = new Category();
  category.name = req.body.name;

  category
    .save()
    .then((savedCategory) => {
      // return res.redirect('/api/admin/add-category');
      //   res.json({ message: 'Success', category: savedCategory });
      return res.redirect(`/api/admin/create-product/${savedCategory.name}`);
    })
    .catch((err) => {
      if (err.code === 11000) {
        req.flash('errors', 'Category already exists');
        return res.redirect('/api/admin/add-category');
      } else {
        return next(err);
      }

    });
});

router.get('/create-product/:name', (req, res, next) => {
  waterfall([
    (callback) => {
      Category.findOne({ name: req.params.name }, (err, category) => {
        if (err) return next(err);

        callback(null, category);
      });
    },
    (category) => {
      for (let i = 0; i < 24; i++) {
        const product = new Product()
        product.category = category._id;
        product.name = faker.commerce.productName();
        product.price = faker.commerce.price();
        product.image = `/images/products2/${i}.jpg`;
        product.description = faker.lorem.paragraph();
        product.save();
      }
    }
  ]);
  req.flash(
    'messages',
    `Successfully added ${req.params.name.toUpperCase()} category and 24 products`
  );
  return res.redirect('/api/admin/add-category');
});

module.exports = router;
