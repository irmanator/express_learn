const md5 = require('md5');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//users ini harusnya dari database dan masuk dalam model
// let users = [
// {id: 1, name:'Bambang', email:'a@b.c'},
// {id: 2, name:'Similikiti', email:'a@b.d'}
// ]

const User = require('../models/user');

//refresh tokens collector
let refreshTokens = [];

module.exports = {
	index: ((req, res) => {
		const userList = User.find({}, (err, users) => {
			if(err) {
				console.log(err);
			} else {
				if(users.length > 0){
					res.json({
						status: true,
						data: users,
						method: req.method,
						url: req.url
					})
				}else{
					res.json({
						status: false,
						message: 'No data'
					})
				}
			}
		})
	}),			
	create: (async (req, res) => {
		// console.log(req.body.password);
		// return;
		try {
			var hashPass = await bcrypt.hash(req.body.password, 10);
		} catch (error) {
			console.log(error);
		}

		//cara 1
		// const userData = new User({
		// 	name: req.body.name,
		// 	email: req.body.email,
		// 	pass: md5(req.body.password)	//mustinya harus di encrypt

		// })
		// userData.save((err, data) => {
		// 	if(err){
		// 		res.json({
		// 			status: false,
		// 			message: 'Failed to save data'
		// 		})
		// 	}else{
		// 		res.json({
		// 			status: true,
		// 			data: data,
		// 			method: req.method,
		// 			url: req.url
		// 		})
		// 		console.log(data)
		// 	}
		// })

		//cara 2, langsung pakai si Model, dlm hal ini User yang diimport dari models/user.js
		User.create({
			name: req.body.name,
			email: req.body.email,
			pass: hashPass
			// pass: md5(req.body.password)
		},(err, data) => {
			if(err){
				res.json({
					status: false,
					message: 'Failed to save data'
				})
			}else{
				res.json({
					status: true,
					data: data,
					method: req.method,
					url: req.url
				})
				console.log(data)
			}
		})
	}),
	update: ((req, res) => {
	const id = req.params.id;
	User.updateOne({_id: id}, {
		name: req.body.name,
		email: req.body.email,
		pass: md5(req.body.password)
	}, (err, data) => {
		if(err){
			res.json({
				status: false,
				message: 'Failed to update data'
			})
		}else{
			res.json({
				status: true,
				data: data,
				method: req.method,
				url: req.url
			})
			console.log(data)
		}
	})
	}),

	////manual mode
	// users.filter(user => {
	// 		if (user.id == id){
	// 			user.id = id
	// 			user.name = req.body.name
	// 			user.email = req.body.email
				
	// 			return user;
	// 		}
	// 	})
	// 	res.send(users)
	// }),
	delete: (req, res) => {
	const id = req.params.id;
		User.findByIdAndDelete(id, (err, user) => {
			if(err){
				res.json({
					status: false,
					message: 'Failed to delete data'
				})
			}else{
				res.json({

					status: true,
					data: user,
					method: req.method,
					url: req.url
				})
				console.log(user)
			}
		})
		// manual mode, syntax ini menghapus data user yang ada di array
		// users = users.filter(user => user.id != id)
		// res.send(users)
	},
	login: async (req, res) => {
		const user = await User.findOne({name: req.body.name});
		// send.res(user);
		// return;
		if(!user){
			res.json({
				status: false,
				message: 'User not found'
			})
		}else{
			try {
				// bcrypt compare will prevent timing attack
				const isMatch = await bcrypt.compare(req.body.password, user.pass);
				if(isMatch){
					//if match add JWT access token
					// buat access dan refresh token
					const tokens = generateToken(user.name);
					refreshTokens.push(tokens.refreshToken);
					res.json({
						status: true,
						message: 'Login success',
						data: tokens
					})
				}else{
					res.json({
						status: false,
						message: 'Wrong password'
					})
				}
			} catch (error) {
				console.log(error);
			}
		}
	},
	token: (req, res) => {
		const refreshToken = req.body.token;
		if(refreshToken == null) return res.sendStatus(401);
		if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if(err) return res.sendStatus(403)
			const accessToken = generateToken({name: user.name});
			res.json({accessToken: accessToken.accessToken});
		})
	},
	tokendel: (req, res) => {
		const refreshToken = req.body.token;
		if(refreshToken == null) return res.sendStatus(401);
		accessToken = null;
		refreshTokens = refreshTokens.filter(token => token !== refreshToken);
		res.sendStatus(204); //successfully delete token
	}
}

function generateToken(user) {
	const accessToken = jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
	const refreshToken = jwt.sign({user: user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '120s'});
	return {accessToken, refreshToken};
};

