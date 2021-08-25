import express, { NextFunction, Request, Response } from 'express'
import cookieParser = require('cookie-parser')
import 'express-async-errors'
import 'colors'

import { routes } from './routes/routes'
import { db } from './config/services/database'

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:*')
  next()
})

app.use(routes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message
    })
  }
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
})

db.connect((erro: any) => {
  if (erro) {
    console.log("Ocorre um erro ao se conectar com o banco de dados(MYSQL)".bgRed)
    console.log(`${erro}`)
    return;
  }
  console.log("Consegui me conectar com o banco de dados(MYSQL)".bgWhite.black)
})

export { app }