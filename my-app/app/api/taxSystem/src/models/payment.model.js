// models/payment.model.js
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amountPaid: DataTypes.DECIMAL(15, 2),
      paymentMethod: DataTypes.STRING,
      receiptUrl: DataTypes.TEXT,
      paymentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    Payment.associate = (models) => {
      Payment.belongsTo(models.TaxCalculation, { foreignKey: "taxCalculationId" });
    };
  
    return Payment;
  };
  