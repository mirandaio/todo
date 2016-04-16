var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SECRET = process.env.SECRET || 'foobar';

exports.encryptPassword = function(plainTextPassword) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainTextPassword, salt);
};

exports.buildToken = function(id) {
  return jwt.sign({_id: id}, SECRET, {expiresIn: 864000});
};

exports.comparePasswords = function(plainTextPassword, password) {
  return bcrypt.compareSync(plainTextPassword, password)
};
