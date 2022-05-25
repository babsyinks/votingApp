'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contestants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJSON(){
      return {...this.get(),id:undefined}
    }
  }
  Contestants.init({
    contestant_id:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    surname:{
      type: DataTypes.STRING,
      allowNull:false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull:false
    },
    position: {
      type: DataTypes.STRING,
      allowNull:false
    },
    manifesto: {
      type: DataTypes.STRING,
      allowNull:false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Contestants',
    tableName: 'contestants'
  });
  return Contestants;
};