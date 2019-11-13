
// REDIS configuration
// -----------------------------------------------------------------------------
const IIOS_REDIS_PORT = process.env.IIOS_REDIS_PORT ? parseInt(process.env.IIOS_REDIS_PORT) : 6379
const IIOS_REDIS_DB = process.env.IIOS_REDIS_DB ? parseInt(process.env.IIOS_REDIS_DB) : 0
let IIOS_REDIS_SENTINELS

if (process.env.IIOS_REDIS_SENTINELS) {
  IIOS_REDIS_SENTINELS = []
  let sentinels = process.env.IIOS_REDIS_SENTINELS.split(',')
  for (let s of sentinels) {
    IIOS_REDIS_SENTINELS.push({ host: s.split(':')[0], port: s.split(':')[1] })
  }
}

// Main configuration structure
// -----------------------------------------------------------------------------
module.exports = {
  /* service name */
  name: process.env.IIOS_SERVICE_NAME || 'auth',
  /* service namesapce */
  namespace: process.env.IIOS_NAMESPACE || 'ignitialio',
  /* heartbeat */
  heartbeatPeriod: process.env.IIOS_HEARTBEAT_PERIOD || 5000,
  /* PUB/SUB/KV connector */
  connector: {
    /* redis server connection */
    redis: {
      /* encoder to be used for packing/unpacking raw messages */
      encoder: process.env.IIOS_ENCODER_ || 'bson',
      master: process.env.IIOS_REDIS_MASTER || 'mymaster',
      sentinels: IIOS_REDIS_SENTINELS,
      host: process.env.IIOS_REDIS_HOST,
      port: IIOS_REDIS_PORT,
      db: IIOS_REDIS_DB
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
        master: process.env.IIOS_REDIS_MASTER || 'mymaster',
        sentinels: IIOS_REDIS_SENTINELS,
        host: process.env.IIOS_REDIS_HOST,
        port: IIOS_REDIS_PORT,
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
        'Username': [ 'Nom d\'utilisateur', 'Nombre de usuario' ],
        'Password': [ 'Mot de passe', 'Contraseña' ],
        'Sign in': [ 'Se connecter', 'Conectarse' ],
        'Sign up': [ 'S\'inscrire', 'Registrarse' ],
        'Password confirm': [ 'Confirmation du mot de passe', 'Confirmar contraseña' ],
        'Passwords do not match': [ 'Les mots de passe ne correspondent pas', 'Las contraseñas no coinciden' ],
        'At least 8 characters': [ 'Minimum 8 caractères', 'Mínimo 8 caracteres' ],
      },
      /* service title */
      title: 'Authentication service',
      /* service description info */
      info: 'Provides IIOS standard authentication method'
    }
  }
}
