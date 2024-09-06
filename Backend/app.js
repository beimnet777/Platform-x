require('dotenv').config({ path: `${process.cwd()}/.env`})
const express = require ('express')
const app = express()

const globalErrorHandler = require('./controller/errorController')
const catchAsyncError = require('./utils/catchAsyncError')
const AppError = require ('./utils/appError')
// Routers
const authRouter = require('./routes/authRoutes')
const orgAdminRouter = require('./routes/orgAdminRoutes')
const agentRouter = require ('./routes/agentRoutes')

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/orgAdmin', orgAdminRouter)
app.use('/api/v1/agent', agentRouter)




app.use(
    catchAsyncError(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    })
);
// global error handler
app.use(globalErrorHandler)

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log ("application is working")
})