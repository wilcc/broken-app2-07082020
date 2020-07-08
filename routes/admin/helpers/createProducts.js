const { waterfall, reject } = require('async');

const Category = require('../categories/models/Category');
const Product = require('../products/models/Product');
const faker = require('faker');

const createProducts = (category) => {
  if (category) {
    return new Promise((resolve, reject) => {
      waterfall([
        (callback) => {
          Category.findOne({ name: category.name }, (err, category) => {
            if (err) return next(err);

            callback(null, category);
          });
        },
        (category) => {
          for (let i = 0; i < 24; i++) {
            const product = new Product();
            product.category = category._id;
            product.name = faker.commerce.productName();
            product.price = faker.commerce.price();
            product.image = `/images/products2/${i}.jpg`;
            product.description = faker.lorem.paragraph();
            product.save();
          }
        }
      ]);
      resolve(category);
    });
  }
};

module.exports = createProducts;
