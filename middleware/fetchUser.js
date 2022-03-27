const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) =>{
    try{
        const token = req.cookies.jwt;
        const verify = jwt.verify(token, process.env.KEY)

        const user = await User.findOne({_id: verify._id})

        req.token = token
        req.user = user

        next()
    }catch(e){
        res.status(200).render('login')
    }
}

module.exports = auth;