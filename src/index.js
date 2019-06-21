import Auth from './components/Auth.vue'
import SignIn from './components/SignIn.vue'
import SignUp from './components/SignUp.vue'

// function to be called when service loaded into web app:
// naming rule: iios_<service_unique_name>
//
global.iios_auth = function(Vue) {
  // Warning: component name must be globally unique in your host app
  Vue.component('auth', Auth)
  Vue.component('signin', SignIn)
  Vue.component('signup', SignUp)

  Vue.prototype.$services.emit('app:menu:add', [
    {
      path: '/signin',
      title: 'Sign in',
      icon: 'lock_outline',
      anonymousAccess: true,
      hideIfLogged: true,
      route: {
        path: '/signin',
        component: SignIn
      }
    },
    {
      path: '/signup',
      title: 'Sign up',
      icon: 'lock_outline',
      anonymousAccess: true,
      hideIfLogged: true,
      route: {
        path: '/signin',
        component: SignUp
      }
    }
  ])

  let onServiceDestroy = () => {
    Vue.prototype.$services.emit('app:menu:remove', [
      {
        path: '/signin'
      },
      {
        path: '/signup'
      }
    ])

    Vue.prototype.$services.emit('service:destroy:auth:done')
  }

  Vue.prototype.$services.once('service:destroy:auth', onServiceDestroy)
}
