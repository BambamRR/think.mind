const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')


//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/', ToughtController.showToughts)
router.get('/dashboard', checkAuth ,ToughtController.dashboard)
router.get('/add', checkAuth ,ToughtController.createTought)
router.post('/add', checkAuth ,ToughtController.createToughtSave)

module.exports = router;