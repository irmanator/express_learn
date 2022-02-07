require('dotenv').config();

const jwt = require('jsonwebtoken');
const express = require('express');
const { send } = require('express/lib/response');
const app = express();

let refreshTokens = [];
//feature parsing data yang masuk
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//refresh token
app.post('/token', (req, res) => {
	const refreshToken = req.body.token;
	if(refreshToken == null) return res.sendStatus(401);
	if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if(err) return res.sendStatus(403)
		const accessToken = generateToken({name: user.name});
		res.json({accessToken})
	})
});

app.delete('/logout', (req, res) => {
	const refreshToken = req.body.token;
	refreshTokens = refreshTokens.filter(token => token !== refreshToken);
	res.sendStatus(204); //successfully delete token
})

//output proses login itu access dan refresh token
app.post('/login', (req, res) => {
	const username = req.body.username
	const user = {name: username}
	const accessToken = generateToken(user);
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	refreshTokens.push(refreshToken); //simpan data token ke array
	res.json({accessToken: accessToken, refreshToken: refreshToken});
});

function generateToken(user) {
	return jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
};

//listener server
app.listen(4000, function(){
	console.log('server is running');
})