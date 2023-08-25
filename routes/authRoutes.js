const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/AuthController')

router.get('/register', AuthController.registerUser)
router.post('/register', AuthController.registerUserSave)

module.exports = router