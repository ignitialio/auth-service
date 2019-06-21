
// REDIS configuration
// -----------------------------------------------------------------------------
const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
const REDIS_DB = process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0
let REDIS_SENTINELS

if (process.env.REDIS_SENTINELS) {
  REDIS_SENTINELS = []
  let sentinels = process.env.REDIS_SENTINELS.split(',')
  for (let s of sentinels) {
    REDIS_SENTINELS.push({ host: s.split(':')[0], port: s.split(':')[1] })
  }
}

// Main configuration structure
// -----------------------------------------------------------------------------
module.exports = {
  /* service name */
  name: process.env.SERVICE_NAME || 'auth',
  /* service namesapce */
  namespace: process.env.IIOS_NAMESPACE || 'ignitialio',
  /* heartbeat */
  heartbeatPeriod: 5000,
  /* PUB/SUB/KV connector */
  connector: {
    /* redis server connection */
    redis: {
      /* encoder to be used for packing/unpacking raw messages */
      encoder: process.env.ENCODER || 'bson',
      master: process.env.REDIS_MASTER || 'mymaster',
      sentinels: REDIS_SENTINELS,
      host: process.env.REDIS_HOST,
      port: REDIS_PORT,
      db: REDIS_DB
    }
  },
  /* access control: if present, acces control enabled */
  accesscontrol: {
    /* access control namespace */
    namespace: process.env.IIOS_NAMESPACE || 'iios',
    /* grants for current service: auto-fill */
    grants: {
      admin: {
        'create:any': [ '*' ],
        'read:any': [ '*' ],
        'update:any': [ '*' ],
        'delete:any': [ '*' ]
      },
      user: {
        'create:own': [ '*' ],
        'read:any': [ '*' ],
        'update:any': [ '*' ],
        'delete:any': [ '*' ]
      },
      anonymous: {
        'update:any': [ '*' ],
        'read:any': [ '*' ]
      }
    },
    /* connector configuration: optional, default same as global connector, but
       on DB 1 */
    connector: {
      /* redis server connection */
      redis: {
        master: process.env.REDIS_MASTER || 'mymaster',
        sentinels: REDIS_SENTINELS,
        host: process.env.REDIS_HOST,
        port: REDIS_PORT,
        db: 1,
        ipFamily: 4
      }
    }
  },
  /* HTTP server declaration */
  server: {
    /* server host */
    host: process.env.IIOS_SERVER_HOST,
    /* server port */
    port: process.env.IIOS_SERVER_PORT,
    /* path to statically serve (at least one asset for icons for example) */
    path: process.env.IIOS_SERVER_PATH_TO_SERVE || './dist',
    /* indicates that service is behind an HTTPS proxy */
    https: false,
  },
  /* jwt configuration : TO BE UPDATED from obfuscated place */
  jwt: {
    secret: process.env.IIOS_JWT_SECRET || 'Once upon the time',
    timeout: process.env.IIOS_JWT_TIMEOUT || '5h'
  },
  /* data service to access users collection */
  data: {
    service: process.env.IIOS_DATA_SERVICE || 'dlake',
    usersCollectionName: process.env.IIOS_USERS_COLLECTION || 'users',
    idName: process.env.IIOS_ID_NAME || 'login.username',
    pwdName: process.env.IIOS_IPWD_NAME || 'login.password'
  },
  /* options published through discovery mechanism */
  publicOptions: {
    /* declares component injection */
    uiComponentInjection: true,
    /* service description */
    description: {
      /* service icon */
      icon: 'assets/auth-64.png',
      /* Internationalization: see Ignitial.io Web App */
      i18n: {
        'Authentication service': [ 'Service d\'autentification' ],
        'Provides IIOS standard authentication method':  [
          'Fournit la méthode d\'autentification dtandard d\'IIOS'
        ],
        'Username': [
          'Nom d\'utilisateur'
        ],
        'Password': [
          'Mot de passe'
        ],
        'Sign in': [ 'Se connecter', 'Conectarse' ],
        'Sign up': [ 'S\'inscrire', 'Registrarse' ]
      },
      /* service title */
      title: 'Authentication service',
      /* service description info */
      info: 'Provides IIOS standard authentication method'
    }
  }
}
