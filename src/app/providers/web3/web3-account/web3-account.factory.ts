export function web3AccountFactory(web3) {
  return new Promise((res, rej) => {
    const existingAcc = web3.eth.accounts
    if (existingAcc && existingAcc[0]) {
      return res(existingAcc[0])
    } else {
      const resp = web3.personal.newAccount()
      res(resp)
    }
  }).then((resp) => {
    return resp
  })
}
