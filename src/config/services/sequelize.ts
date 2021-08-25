const { Sequelize } = require('sequelize-typescript')
import 'dotenv/config'

const connection = () => new Sequelize(`mysql://${process.env.SEQUELIZE_USERNAME}:${process.env.SEQUELIZE_PASSWORD}@${process.env.SEQUELIZE_HOST}:3307/${process.env.SEQUELIZE_DATABASE}`)

export { connection }