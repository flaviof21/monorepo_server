// ####START_IMPORTS
import express = require('express');
import { Request, Response } from 'express'
const cors = require('cors')
import 'ejs';

import userController from '../app/controllers/userController'
import osController from '../app/controllers/osController'
import clientController from '../app/controllers/clientController'
import authMiddleware from '../app/middlewares/authMiddleware'
import permMiddleware from '../app/middlewares/permMiddleware'
import tabelaClient from '../models/tabelaClients'
// ####END_IMPORTS

const app = express()
const routes = express.Router()

app.use(cors())

// PAG CLIENTES
routes.get('/clients', 
  clientController.listar
)
routes.get('/clients/update-client?id=:id', [authMiddleware, permMiddleware(['owner', 'director', 'developer'])], async (req: Request, res: Response) => {
  const id = req.query.id;
  const clientEncontrado = await tabelaClient.findOne({where: {id: id}})
  res.render(__dirname + '/views/updateClient.ejs', { clients: clientEncontrado })
})
routes.get('/clients/:idEmpresa', [authMiddleware, permMiddleware(['owner', 'director', 'developer', 'employee'])],
  clientController.carregar 
)
routes.post('/api/clients', [authMiddleware, permMiddleware(['owner', 'director', 'developer'])], 
  clientController.criar
)
routes.put('/api/clients/:idEmpresa', [authMiddleware, permMiddleware(['owner', 'director', 'developer'])],
  clientController.atualizar
)

routes.post('/api/user/register', 
  userController.criar
)
routes.post('/api/user/login',
  userController.logar
)
routes.post('/user/forgot_password', userController.forgotPassword)

// PAG OS
routes.get('/api/os',
  osController.listar
)
routes.get('/api/os/:idOs',
    osController.carregar/*  */
)
routes.post('/api/os/create', 
    osController.criar
)

routes.put('/api/test', (req, res) => {
  console.log(req)
})

routes.get('/me', async (req, res) => {
  const token = 'Stringdetokentest'
  res.render(__dirname + '/config/messages/forgot_password', { token: token })
})


export { routes }