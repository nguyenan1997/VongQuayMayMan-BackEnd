const sequelize = require('../config/db');
const User = require('./userModel');
const Prize = require('./prizeModel');

module.exports = {
    sequelize,
    User,
    Prize
};
