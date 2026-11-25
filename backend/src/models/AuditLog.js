const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true, // Can be null for system actions or failed logins
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        resource_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    }, {
        timestamps: true,
        updatedAt: false, // Immutable log
        tableName: 'audit_logs',
    });

    AuditLog.associate = (models) => {
        AuditLog.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return AuditLog;
};
