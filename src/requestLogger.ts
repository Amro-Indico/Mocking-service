import chalk = require('chalk')
import { Request, Response, NextFunction } from 'express'

import app from './app'

function printJSON(
  a: any,
  highlight: string[] = [
    'aid',
    'creationTime',
    'recordedTime',
    'bucket',
    'key',
    'fid',
    'filename',
    'title',
    'description'
  ],
  errors: string[] = ['err', 'error', 'errors']
) {
  return JSON.stringify(a, null, !process.env.NO_PRETTY_LOG ? 2 : 0)
    .replace(/\"/g, '')
    .replace(
      new RegExp(`(s*)(${highlight.join('|')}):`, 'g'),
      chalk`$1{green $2}:`
    )
    .replace(new RegExp(`(s*)(${errors.join('|')}):`, 'g'), chalk`$1{red $2}:`)
    .replace(/: (.*)\,?[\n\r]/g, chalk.blue(': $1\n'))
}

function requestLogger(req: Request, res: Response, next: NextFunction) {
  const oldWrite: any = res.write
  const oldEnd: any = res.end

  const chunks: any[] = []

  res.write = function(chunk: any) {
    chunks.push(chunk)

    oldWrite.apply(res, arguments)
    return true
  }

  res.end = function(chunk: any) {
    if (chunk) chunks.push(chunk)
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      console.log(
        chalk.bold(
          chalk`\n\n ➡️{yellow ${req.method} ${req.path}}`,
          chalk.cyan(req.headers['system-id'], req.headers['kall-id']),
          printJSON(req.body)
        ),
        chalk.yellow('\n ⬅️'),
        printJSON(body)
      )
    } catch (err) {
      console.log(chalk.red(chunk.toString()))
    }

    oldEnd.apply(res, arguments)
  }

  next()
}

export default requestLogger
