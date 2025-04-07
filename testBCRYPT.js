var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("nadiaaa", salt);

// console.log(hash);

// console.log(bcrypt.compareSync("nadiaaa", hash)); // true

// console.log(bcrypt.compareSync("nadia", hash)); // false
