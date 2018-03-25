import '~/utils/global'
// import { trackPage } from '~/utils/global-config'
import '~/utils/helpers'
import DefineMap from 'can-define/map/map'
import route from 'can-route'
import 'can-route-pushstate'
import 'can-debug#?./is-dev'
import 'jquery'
import 'bootstrap'
import Session from './models/session'

const AppViewModel = DefineMap.extend({
  env: {
    default: () => ({NODE_ENV: 'development'}),
    serialize: false
  },
  page: {
    type: 'string',
    serialize: true
  },
  slug: {
    type: 'string',
    serialize: true
  },
  target: {
    type: 'string',
    serialize: true
  },
  message: {
    default: 'Hello World!',
    serialize: false
  },
  title: {
    serialize: false,
    get () {
      if (this.page === 'privacy') {
        return 'Tx | Privacy Statement'
      } else if (this.page === 'terms') {
        return 'Tx | Terms of Service'
      } else {
        return 'Tx | Built with Blocks'
      }
    }
  },
  session: {
    serialize: false,
    Type: Session,
    default: function () {
      const current = new Session()
      Session.current = current
      return current
    },
    set (val) {
      if (this.session) {
        this.session.clearAuthInterval()
      }
      val.authenticate()
        .catch(() => {})
      return val
    }
  }
})

route.register('{page}', { page: 'home' })
route.register('{page}/{slug}', { slug: null })
route.register('{page}/{slug}/{target}', { target: null })

export default AppViewModel
