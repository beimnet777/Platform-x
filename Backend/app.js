require('dotenv').config({ path: `${process.cwd()}/.env`})
const https = require('https');

const path = require('path')
const express = require ('express')
const app = express()
const cors = require('cors');

const globalErrorHandler = require('./controller/errorController')
const catchAsyncError = require('./utils/catchAsyncError')
const AppError = require ('./utils/appError')
//logger
const { requestLogger, errorLogger } = require('./middleware/logger');
// Routers
const authRouter = require('./routes/authRoutes')
const orgAdminRouter = require('./routes/orgAdminRoutes')
const agentRouter = require ('./routes/agentRoutes')
const superAdminRouter = require('./routes/superAdminRoutes')


app.use(cors())
// middleware to log all incoming requests
app.use(requestLogger);

app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/orgAdmin', orgAdminRouter)
app.use('/api/v1/agent', agentRouter)
app.use('/api/v1/superAdmin', superAdminRouter)




app.use(
    catchAsyncError(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    })
);

app.use(errorLogger)
// global error handler
app.use(globalErrorHandler)

setInterval(()=>{
    
    https.get("https://platform-x.onrender.com/uploads/1725641517698-909081345.mp3");
  
  },10 * 60 * 1000)

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log ("application is working")
})