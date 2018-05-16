import {Config} from '../../../../config/Config'

export function configFactory(): Config {
  return require('../../../../config/default.js')
}
