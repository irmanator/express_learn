require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const userController = require('../controllers/user.js');

// user login
router.post('/user/login', userController.login);

// sudah di pindah dlm struktur MVC controller controller/user.js
// proses update menggunakan model filter dari user/ID
router.put('/user/:id', JWTAccessCheck, userController.update);

// delete menggunakan parameter ID
router.delete('/user/:id', JWTAccessCheck, userController.delete);

router.post('/token', userController.token);

router.delete('/tokendel', userController.tokendel);

//grouping route
router.route('/paket')
	.get(JWTAccessCheck, userController.index) //ini pake JWT check
	.post(userController.create);

//JWT with bearer TOKEN checking
function JWTAccessCheck(req, res, next) {

	// const authCookie = req.cookies.appCookie;
	// if (authCookie) {
	// 	const token = authCookie;
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1]; //bearer[spasi]TOKEN
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				res.sendStatus(403);
			} else {
				req.user = user;
				next();
			}
		});
	} else {
		res.sendStatus(401);
	}
}
	
module.exports = router