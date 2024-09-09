const AppError  = require("../utils/appError")

const sendErrorDev = (err, res) =>{
    const statusCode = err.statusCode || 500
    const status = err.status || "fail"
    const message = err.message
    const stack = err.stack


    res.status(statusCode).json({
        status,
        message,
        stack
    })
}

const sendErrorProd = (err, res) =>{
    const statusCode = err.statusCode || 500
    const status = err.status || "fail"
    const message = err.message
    const stack = err.stack
    if (err.isOperational){
        res.status(statusCode).json({
            status,
            message,
        })
    }

    res.status(statusCode).json(err)
}

const globalErrorHandler = (err,req,res,next) =>{

    if (err.name === 'JsonWebTokenError') {
        err = new AppError('Invalid token', 401);
    }
    if (err.name === 'SequelizeValidationError') {
        err = new AppError(err.errors[0].message, 400);
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
        err = new AppError(err.errors[0].message, 400);
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(err)
        return sendErrorDev(err, res);
    }
    sendErrorProd(err, res);
}

module.exports = globalErrorHandler