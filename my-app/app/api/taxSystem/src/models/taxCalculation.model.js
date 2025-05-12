// models/taxCalculation.model.js
module.exports = (sequelize, DataTypes) => {
    const TaxCalculation = sequelize.define("TaxCalculation", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      taxableAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      taxRate: {
        type: DataTypes.DECIMAL(5, 4), // e.g., 0.15 for 15%
        allowNull: false,
      },
      taxDue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      status: DataTypes.ENUM('pending_audit', 'audited', 'approved'),
      remarks: DataTypes.TEXT,
    });
  
    TaxCalculation.associate = (models) => {
      TaxCalculation.belongsTo(models.TaxPeriod, { foreignKey: "taxPeriodId" });
      TaxCalculation.belongsTo(models.TaxType, { foreignKey: "taxTypeId" });
      TaxCalculation.belongsTo(models.User, { foreignKey: "auditorId" }); // Auditor
      TaxCalculation.hasMany(models.Payment, { foreignKey: "taxCalculationId" });
    };
  
    return TaxCalculation;
  };
  