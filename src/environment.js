import loader from '@loader'

let hostname = window.location.hostname
let proto = window.location.protocol
let host = hostname === 'localhost' ? 'localhost:3030' : loader.serviceBaseURL

export default {
  apiUrl: `${proto}//${host}`,
  isLocal: hostname === 'localhost',
  useXhrTransport: window.useXhrTransport
}
