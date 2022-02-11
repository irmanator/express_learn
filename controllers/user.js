const md5 = require('md5');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const generateTokenx = require('../generateToken.js');

//users ini harusnya dari database dan masuk dalam model
// let users = [
// {id: 1, name:'Bambang', email:'a@b.c'},
// {id: 2, name:'Similikiti', email:'a@b.d'}
// ]

const User = require('../models/user');

//refresh tokens collector
let refreshTokens = [];

module.exports = {
	login: async (req, res) => {
		const {name, pass} = req.body;

		var user = await User.findOne({name: name});
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
				const isMatch = await bcrypt.compare(pass, user.pass);
				
				if(isMatch){
					//if match add JWT access token
					// buat access dan refresh token
					
					const tokens = generateToken(user);
					refreshTokens.push(tokens.refreshToken);
					res.cookie("appCookie", tokens.accessToken, {	// bikin httponly cookie
						httpOnly: true,
						expires: dayjs().add(1, "days").toDate()
					});

					res.json({
						status: true,
						message: 'Login success',
						data: tokens
					})
					// await generateTokenx(res, user.name, user.kode);
				}else{
					res.json({
						status: false,
						message: 'Wrong pass'
					})
				}
			} catch (error) {
				console.log(error);
			}
		}
	},
	index: ((req, res) => {
		const kodeuser = decodeToken(req.headers.authorization).payload.kode;
		// console.log(kodeuser); return;
		if (kodeuser === 'bolpen'){ //kalo nemu Unauthorized brati ganti dari spidol ato bolpen
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
	}else{
		res.json({
			status: false,
			message: 'Unauthorized'
		})
	}
	}),			
	create: (async (req, res) => {
		// console.log(req.body.pass);
		// return;
		try {
			var hashPass = await bcrypt.hash(req.body.pass, 10);
		} catch (error) {
			console.log(error);
		}

		User.create({
			name: req.body.name,
			email: req.body.email,
			kode: req.body.kode,
			pass: hashPass
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
		pass: md5(req.body.pass)
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
	token: (req, res) => {
		const refreshToken = req.body.token;
		if(refreshToken == null) return res.sendStatus(401);
		if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if(err) return res.sendStatus(403)
			const accessToken = generateToken({name: user.name, kode: user.kode});
			res.json({accessToken: accessToken.accessToken});
		})
	},
	tokendel: (req, res) => {
		const refreshToken = req.body.token;
		if(refreshToken == null) return res.sendStatus(401);
		accessToken = null;
		refreshTokens = refreshTokens.filter(token => token !== refreshToken);
		return res.json({"status":"Successful logout"}).sendStatus(204); //successfully delete token
	}
}

function generateToken(obj) {
	const name = obj.name;
	const kode = obj.kode;
	const accessToken = jwt.sign({user: name, kode: kode}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
	const refreshToken = jwt.sign({user: name, kode: kode}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '120s'});
	return {accessToken, refreshToken, name, kode};
};

function decodeToken(token){
	if (token) {
		const jwtoken = token.split(' ')[1]; //bearer[spasi]TOKEN
		const a = jwt.decode(jwtoken, {complete: true});
		return a;	// focus on payload
	}
}