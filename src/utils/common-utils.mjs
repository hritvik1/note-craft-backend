export const CommonUtils = {

  sendSuccessResponse : (res, data) => {
    const resp = {
      data : { success : 'OperationSuccess' }
    }

    if(data) resp.data.response = data
    res.body = resp
    res.status(200).json(resp)
  },

  sendErrorResponse : (res, errMessage, errName = 'ValidationError', errCode = 400) => {
    const resp = {
      data : {
        error   : errName,
        message : errMessage ?? []
      }
    }

    res.body = resp
    res.status(errCode).json(resp)
  }
}
