const { Sequelize } = require('sequelize')
const chalk = require('chalk')
require('dotenv').config()

const { DB_HOST, DB_USER, DB_DATABASE, DB_PASSWORD } = process.env

const sequelize = new Sequelize( DB_DATABASE, DB_USER, DB_PASSWORD,{
    dialect: 'mysql',
    host: DB_HOST
})

try {
    sequelize.authenticate()
    console.log(chalk.bgGreen.black("Banco de Dados Conectado com Sucesso"))
} catch (error) {
    console.log(chalk.bgRed.black("Erro ao conectar no Banco de Dados: "), + error)
}

module.exports = sequelize