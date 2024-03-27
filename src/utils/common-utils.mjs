export const CommonUtils = {

  sendErrorResponse : (res, errObj) => {
    errObj.name = errObj.name ?? 'ValidationError'
    errObj.message = errObj.message ?? ':('
    errObj.code = errObj.code ?? 400

    const resp = {
      data : {
        error   : errObj.name,
        message : errObj.message
      }
    }

    res.body = resp
    res.status(errObj.code).json(resp)
  }
}
