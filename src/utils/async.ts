import type { NextFunction, Request, Response } from 'express'

// eslint-disable-next-line ts/no-unsafe-function-type
export function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next)
  }
}
