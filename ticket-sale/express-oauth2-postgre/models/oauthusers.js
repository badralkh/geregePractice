'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OAuthUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  OAuthUsers.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    otp: DataTypes.STRING,
    verified: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OAuthUsers',
  });
  return OAuthUsers;
};