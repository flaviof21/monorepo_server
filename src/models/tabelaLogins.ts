const Sequelize = require('sequelize');
const { connection } = require('../config/services/sequelize')

const colunas = {
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
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
  tableName: 'logins',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}

const Note = connection().define('logins', colunas, options)

export default Note