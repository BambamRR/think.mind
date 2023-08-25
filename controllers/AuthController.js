const User = require('../models/User')

module.exports = class UserController {
    static async registerUser (req, res) {
        res.render('auth/register')
    }
    static async registerUserSave ( req, res ) {
        res.redirect('auth/login')
    }
}