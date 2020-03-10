import { Logging } from '@google-cloud/logging'

import utils from '../utils'

const projectId = process.env.GCP_PROJECT_ID || ''
const logging = new Logging({ projectId })
const gcplog = logging.log('keencat')
const resource = { type: 'global' }

async function debug(data: any) {
  if (utils.isDev()) console.log(data)
  else await gcplog.write(gcplog.entry({ resource, severity: 'DEBUG' }, data))
}

async function info(data: any) {
  if (utils.isDev()) console.log(data)
  else await gcplog.write(gcplog.entry({ resource, severity: 'INFO' }, data))
}

async function notice(data: any) {
  if (utils.isDev()) console.log(data)
  else await gcplog.write(gcplog.entry({ resource, severity: 'NOTICE' }, data))
}

async function error(data: any) {
  if (utils.isDev()) console.error(data)
  else await gcplog.write(gcplog.entry({ resource, severity: 'ERROR' }, data))
}

export default {
  debug,
  info,
  notice,
  error,
}
