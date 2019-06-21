const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const Gateway = require('@ignitial/iio-services').Gateway

const config = require('./config')
const utils = require('./lib/utils')
const pino = utils.pino

class Auth extends Gateway {
  constructor(options) {
    super(options)
  }

  _checkPassword(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        let usersServiceName = this._options.data.service + ':' +
          this._options.data.usersCollectionName

        let query = {}
        query[this._options.data.idName] = username

        // must add userId in order to trig privileged flag check
        let user = await this.api[usersServiceName].dGet(query, {
          $userId: null,
          $privileged: true
        })

        if (!user) {
          reject(new Error('bad username'))
          return
        }

        let userPassword = utils.getByPath(user, this._options.data.pwdName)

        if (bcrypt.compareSync(password, userPassword)) {
          utils.setByPath(user, this._options.data.pwdName, undefined)
          user.lastConnection = new Date()

          let token = jwt.sign(user, this._options.jwt.secret, {
            expiresIn: this._options.jwt.timeout
          })

          resolve({
            user: user,
            token: token
          })
        } else {
          reject(new Error('bad password'))
        }
      } catch (err) {
        console.log(err)
        reject(new Error('bad username'))
      }
    })
  }

  _checkToken(token) {
    return new Promise((resolve, reject) => {
      console.log('TOKEN', token)
      jwt.verify(token, this._options.jwt.secret, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      })
    })
  }

  /* get user info from token */
  authenticate(token) {
    // @_GET_
    return new Promise((resolve, reject) => {
      this._checkToken(token).then(decoded => {
        resolve(decoded)
      }).catch(err => {
        pino.error(err, 'authentication failed')
        reject(err)
      })
    })
  }

  /* let caller know if user is authenticated and can proceed */
  authorize(token) {
    // @_GET_
    return new Promise((resolve, reject) => {
      this._checkToken(token).then(decoded => {
        if (!decoded) {
          reject(new Error('failed to authorize'))
        }

        resolve(utils.getByPath(decoded, this._options.data.idName))
      }).catch(err => {
        pino.error(err, 'authorize failed')
        reject(err)
      })
    })
  }

  signin(username, password) {
    return new Promise((resolve, reject) => {
      this._checkPassword(username, password).then(response => {
        resolve(response)
      }).catch(err => {
        pino.error(err, 'signin failed')
        reject(err)
      })
    })
  }

  signup(user) {
    return new Promise(async (resolve, reject) => {
      try {
        let usersServiceName = this._options.data.service + ':' +
          this._options.data.usersCollectionName

        let salt = bcrypt.genSaltSync(10)
        let hash =
          bcrypt.hashSync(utils.getByPath(user, this._options.data.pwdName), salt)

        utils.setByPath(user, this._options.data.pwdName, hash)

        let response = await this.api[usersServiceName].dPut(user, {
          $userId: null,
          $privileged: true
        })

        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  chpwd(password, newPassword, grants) {
    // @_PUT_
    return new Promise(async (resolve, reject) => {
      try {
        let query = {}
        query[this._options.data.idName] = grants.$userId
        let user = await this.api[usersServiceName].dGet(query)
        if (!user) {
          reject(new Error('bad username'))
          return
        }

        // compute password hash
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(newPassword, salt)

        utils.setByPath(user, this._options.data.pwdName, hash)

        let response = await this.api[usersServiceName].dPut(user, {
          $userId: null,
          $privileged: true
        })

        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

// instantiate service with its configuration
const auth = new Auth(config)

auth._init().then(() => {
  console.log('auth service named [' + auth.name + ']: initialization done with options', auth._options)
}).catch(err => {
  console.error('initialization failed', err)
  process.exit(1)
})
