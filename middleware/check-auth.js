 const jwt = require('jsonwebtoken');

 module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secrete_this_should_be_longer')
        
        //console.log(decoded)        
        req.userData = {
            userId: decoded.userId
        }
        console.log(userData)
        next();
    } catch (err) {
        res.status(401).json({message: "Unauthorised request"})
    }
 };