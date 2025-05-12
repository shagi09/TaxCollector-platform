// models/taxType.model.js
module.exports = (sequelize, DataTypes) => {
    const TaxType = sequelize.define("TaxType", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING, // Profit Tax, Net VAT, etc.
      frequency: DataTypes.ENUM('monthly', 'yearly'),
      description: DataTypes.TEXT,
    });
  
    TaxType.associate = (models) => {
      TaxType.hasMany(models.TaxCalculation, { foreignKey: "taxTypeId" });
    };
  
    return TaxType;
  };
  