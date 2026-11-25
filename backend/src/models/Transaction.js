const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        land_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        buyer_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        seller_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('ESCROW_DEPOSITED', 'VERIFICATION_PENDING', 'APPROVED', 'RELEASED', 'CANCELLED'),
            defaultValue: 'ESCROW_DEPOSITED',
        },
        escrow_ref: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'transactions',
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.Land, { foreignKey: 'land_id', as: 'land' });
        Transaction.belongsTo(models.User, { foreignKey: 'buyer_id', as: 'buyer' });
        Transaction.belongsTo(models.User, { foreignKey: 'seller_id', as: 'seller' });
    };

    return Transaction;
};
