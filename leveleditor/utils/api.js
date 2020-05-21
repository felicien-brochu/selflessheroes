const axios = require('axios')
const FormData = require('form-data')
const apiConfig = require('./api-config')
const chalk = require('chalk')

function apiUrl(path) {
  return `${apiConfig.API_URL}${path}`
}

let jwtToken = null

module.exports = {
  login: async function(loginInfo) {
      try {
        let req = await axios.post(apiUrl('/auth/login'), loginInfo)
        if (req.isAxiosError) {
          return req
        }

        jwtToken = req.data.token
        return req
      } catch (error) {
        return error
      }
    },

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
          },

          uploadLevel: async function(levelId, fileData) {
            try {
              const formData = new FormData()
              formData.append("file", fileData, "level.zip")
              const requestConfig = {
                headers: {
                  "Authorization": "Bearer " + jwtToken,
                  ...formData.getHeaders()
                }
              }
              return await axios.post(apiUrl(`/level/upload/${levelId}`), formData, requestConfig)
            } catch (error) {
              return error
            }
          }
}