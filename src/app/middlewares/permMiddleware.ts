import { Request, Response, NextFunction } from 'express'

export default (roleRequire: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (roleRequire.indexOf(req.user.role) === -1) {
        res.status(401).send('Error')
        console.log(`${req.user.id} | ${req.user.nome} tentou entrar em uma página sem permissão`)
        return 
    } 
    next()
}