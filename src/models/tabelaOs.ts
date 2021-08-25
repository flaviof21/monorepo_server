const Sequelize = require('sequelize');
const { connection } = require('../config/services/sequelize')

const colunas = {
    cliente: {
        type: Sequelize.STRING,
        allowNull: false
    },
    peca: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantidade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    peso: {
        type: Sequelize.STRING,
        allowNull: false
    },
    valor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}

const options = {
    freezeTableName: true,
    tableName: 'os',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}

const Note = connection().define('os', colunas, options)

export default Note