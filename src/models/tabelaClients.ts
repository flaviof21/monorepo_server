const Sequelize = require('sequelize');
const { connection } = require('../config/services/sequelize')

const colunas = {
  empresa: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cnpj: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telephone: {
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
  tableName: 'clientes',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}

const Note = connection().define('clientes', colunas, options)

export default Note