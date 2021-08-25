import { Request, Response } from 'express'
import path from 'path';

const connection = require('../../config/services/database');
import tabelaClient from '../../models/tabelaClients';

type datas = {
  id?: number
  client?: string,
  cnpj?: string,
  email?: string,
  telephone?: string | number,
  valor?: number,
  created_at?: string,
  updated_at?: string,
}
type results = {
  id?: number,
  client?: string,
  cnpj?: string,
  email?: string,
  telephone?: string | number,
  valor?: number,
  created_at?: string,
  updated_at?: string,
}

export default {
  constructor({ id, client, cnpj, email, telephone, created_at, updated_at }) {
    this.id = id;
    this.client = client;
    this.cnpj = cnpj;
    this.email = email;
    this.telephone = telephone;
    this.created_at = created_at;
    this.updated_at = updated_at;
  },

  async criar(req: Request, res: Response) {
    const { client, cnpj, email, telephone } = req.body;
    const dados: datas = {
      client,
      cnpj,
      email,
      telephone
    }

    const resultado: results = ({
      client: dados.client,
      cnpj: dados.cnpj,
      email: dados.email,
      telephone: dados.telephone,
    })
    dados.id = resultado.id,
    dados.created_at = resultado.created_at,
    dados.updated_at = resultado.updated_at
    await tabelaClient.create(resultado)
    console.log(resultado)
    res.send(resultado)
  },

  async listar(req: Request, res: Response) {
    const resultado = await tabelaClient.findAll();
    res.render(path.join(__dirname + '/../../views/clients.ejs'), { clients: resultado })
  },

  async carregar(req: Request, res: Response) {
    const id = new String(req.params.idEmpresa);
    if (typeof id === 'string' || id.length === 0) {
      return
    }
    const clientEncontrado = await tabelaClient.findOne({
      where: {
        id: id
      }
    })

    if (!clientEncontrado) {
      return res.send(
        JSON.stringify({
          message: "Cliente não encontrado"
        })
      )
    }

    res.status(200).send(clientEncontrado)
  },

  async atualizar(req: Request, res: Response) {
    const id = req.params.idEmpresa;
    await tabelaClient.findOne({
      where: {
        id: id
      }
    })
    const { client, cnpj, email, telephone } = req.body;
    const campos = ['client', 'cnpj', 'email', 'telephone']
    const dadosRecebidos = {
      client,
      cnpj,
      email,
      telephone
    }
    const dados = Object.assign({}, dadosRecebidos, { id: id })
    const dadosparaAtualizar = {}

    campos.forEach(async (campo) => {
      const valor = dados[campo]
      if (typeof valor === 'string' && valor.length > 0) {
        dadosparaAtualizar[campo] = valor
      }

      if (Object.keys(dadosparaAtualizar).length === 0) {
        throw new Error('Não foram fornecidos dados suficientes para atualizar ')
      }
      await tabelaClient.update(
        dadosparaAtualizar,
        {
          where: {
            id: id
          }
        }
      )
    })
    res.send(dados)
  },
}
