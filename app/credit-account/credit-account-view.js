const $ = require('jQuery')
const EventEmitter = require('events').EventEmitter

class CreditAccountView extends EventEmitter {

  constructor () {
    super()
    $('#credit-account-form').on('submit', (e) => {
      this.emit('submitCreditRequest')
      e.preventDefault()
    })
  }

  showEthereumAccount ({accountHash}) {
    $('#account-div').text(`your aletheia blockchain account is "${accountHash}"`)
  }

  showEthereumBalance ({balance}) {
    $('#balance-div').text(`your aletheia goodwill balance is "${balance}"`)
  }

  getCaptchaAnswer () {
    return $('#captcha-input').val()
  }
  setCaptcha (value) {
    return $('#captcha-img').attr('src', 'data:image/svg+xml;utf8,' + value)
  }
}

module.exports = new CreditAccountView()
