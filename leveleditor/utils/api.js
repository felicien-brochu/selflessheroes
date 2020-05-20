const axios = require('axios')
const apiConfig = require('./api-config')

function apiUrl(path) {
  return `${apiConfig.API_URL}${path}`
}

module.exports = {
  registerUser: async function(userInfo) {
      try {
        return await axios.put(apiUrl('/auth/register'), userInfo)
      } catch (error) {
        return error
      }
    },

    activateUserAccount: async function(body) {
        try {
          return await axios.put(apiUrl('/auth/activate'), body)
        } catch (error) {
          return error
        }
      },

      sendActivationCodeEmail: async function(body) {
        try {
          return await axios.post(apiUrl('/auth/sendActivationCode'), body)
        } catch (error) {
          return error
        }
      }
}