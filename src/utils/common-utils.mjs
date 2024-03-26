export const commonUtils = {

  sendErrorResponse : (res, errMessage, code = 400) => {
    const resp = {
      data : {
        error           : 'ValidationError',
        ValidationError : errMessage
      }
    }

    res.body = resp
    res.status(code).json(resp)
  }
}
