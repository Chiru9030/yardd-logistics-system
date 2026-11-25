const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('BUYER', 'SELLER', 'VERIFIER', 'ADMIN'),
            allowNull: false,
            defaultValue: 'BUYER',
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        kyc_doc_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'users',
    });

    return User;
};
