const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.js');

// sudah di pindah dlm struktur MVC controller controller/user.js
// proses update menggunakan model filter dari user/ID
router.put('/user/:id', userController.update);

// delete menggunakan parameter ID
router.delete('/user/:id', userController.delete);

// delete menggunakan parameter ID
router.post('/user/login', userController.login);

//grouping route
router.route('/paket')
	.get(userController.index)
	.post(userController.create)
	
module.exports = router