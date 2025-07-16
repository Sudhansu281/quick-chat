const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //{userId: user._id}

          req.user = { userId: decodedToken.userId };
          console.log("✅ userId from token:", req.user.userId);

        next();
    }catch(error){
        res.send({
            message: error.message,
            success: false
        });
    }
}