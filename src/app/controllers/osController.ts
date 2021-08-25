import { Request, Response } from 'express'
import tabelaOs from "../../models/tabelaOs";

type datas = {
  id?: number
  client?: string,
  peca?: string,
  quantidade?: string | number,
  peso?: string,
  valor?: number,
  created_at?: string,
  updated_at?: string,
}
type results = {
  id?: number,
  cliente?: string,
  peca?: string,
  quantidade?: string | number,
  peso?: string,
  valor?: number,
  created_at?: string,
  updated_at?: string,
}

export default {
  constructor({ id, client, peca, quantidade, peso, valor, created_at, updated_at }) {
    id = id;
    this.client = client;
    this.peca = peca;
    this.quantidade = quantidade;
    this.peso = peso;
    this.valor = valor;
    this.created_at = created_at;
    this.updated_at = updated_at;
  },

  async criar(req: Request, res: Response) {
    const { client, peca, quantidade, peso, valor } = req.body;
    const dados: datas = {
      client,
      peca,
      quantidade,
      peso,
      valor,
    }

    try {
      const resultado: results = ({
        cliente: dados.client,
        peca: dados.peca,
        quantidade: dados.quantidade,
        peso: dados.peso,
        valor: dados.valor
      })
      dados.id = resultado.id,
      dados.created_at = resultado.created_at,
      dados.updated_at = resultado.updated_at
      await tabelaOs.create(resultado)

      res.status(201).send(req.body)
    } catch (error) {
      res.end()
      console.log(error)
    }

  },

  async listar(req: Request, res: Response) {
    const resultado = await tabelaOs.findAll();
    res.send(
      resultado
    )
  },

  async carregar(req: Request, res: Response) {
    const id = req.params.idOs;
    const osEncontrada = await tabelaOs.findOne({
      where: {
        id: id
      }
    })
    if (!osEncontrada) {
      throw new Error(`OS ${id} não encontrada`)
    }
    res.send(osEncontrada)
  },

  async exporta(req: Request, res: Response) {
    const { id } = req.body
    console.log(req.body)
  }

}