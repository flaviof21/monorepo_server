import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import config from '../../config/services/jwt'
import userModel from '../../models/tabelaLogins'

type user = {
  id: number,
  nome: string,
  email: string,
  role: string,
  created_at: string | number | any;
}
  
declare global {
  namespace Express {
    interface Request {
      user: user
    }
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  let auth = req.cookies.Authentication;

  if (!auth) {
    return res.status(401).redirect('/login')
  }

  let [, token] = auth.split(' ')
  try {
    const decoded = await promisify(jwt.verify)(token, config.secret)

    if (!decoded) {
      return res.status(401).redirect('/login')
    } else {
      let fullUser = await userModel.findByPk(decoded.id)
      req.user = {
        id: decoded.id,
        nome: fullUser.nome,
        email: fullUser.email,
        role: fullUser.role,
        created_at: fullUser.created_at
      }
      next();
    }
  } catch {
    return res.status(401).redirect('/login')
  }
}