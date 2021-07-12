'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ticketOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ticketOrder.init({
    username: DataTypes.STRING,
    event: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unitprice: DataTypes.FLOAT,
    totalprice: DataTypes.FLOAT,
    barcode: DataTypes.STRING,
    completed: DataTypes.BOOLEAN,
    checkedin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ticketOrder',
  });
  return ticketOrder;
};