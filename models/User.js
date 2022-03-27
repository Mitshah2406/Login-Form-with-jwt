const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true,
            trim: true,
        }
    }]
}, {timestamps: true})

schema.methods.JSONAuth = async function(){
    try{
        const token = jwt.sign({_id: this._id.toString()}, process.env.KEY)
        this.tokens = this.tokens.concat({token: token})
        await this.save()
        return token;
    }catch(err){
        console.log(err);
    }
}

module.exports = mongoose.model('user', schema)