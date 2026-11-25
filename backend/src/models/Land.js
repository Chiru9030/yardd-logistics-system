const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Land = sequelize.define('Land', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        seller_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        survey_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        area_sqft: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        geo_coordinates: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'APPROVED', 'SOLD', 'REJECTED'),
            defaultValue: 'PENDING',
        },
        document_path: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        document_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'lands',
    });

    Land.associate = (models) => {
        Land.belongsTo(models.User, { foreignKey: 'seller_id', as: 'seller' });
    };

    return Land;
};
