const jwt = require ("jsonwebtoken")
const AppError = require("../utils/appError")
const catchAsyncError = require("../utils/catchAsyncError");
const user = require("../db/models/user/user");


const authentication = catchAsyncError(async (req,res,next) =>{
    // getting the token   
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    idToken = req.headers.authorization.split(' ')[1]
    }
    

    if (!idToken){return next(new AppError("You are not logged in", 401))}

    // token verification

    const details= jwt.verify(idToken, process.env.JWT_SECRET_KEY)
    console.log(details.id)
    const loggedUser  = await user.findByPk(details.id)

    if (!loggedUser){
        next (new AppError("User doesn't exist anymore"))
    }

    req.user = loggedUser
    return next()


    }
)


const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        if (!userType.includes(req.user.userType)) {
            return next(
                new AppError(
                    "You don't have permission to perform this action",
                    403
                )
            );
        }
        return next();
    };

    return checkPermission;
};

module.exports = {authentication, restrictTo}
