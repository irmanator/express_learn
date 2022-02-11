require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.use(
	cors({
		// origin: 'http://localhost:8080', //only allows specific url with port
		origin: '*', //allows to all urls
		methods:["GET", "POST","DELETE", "PUT"], //ditulis supaya ga kena XSS
		// "OPTIONS", "HEAD", "CONNECT", "GET", "POST", "PUT", "DELETE", "PATCH",
		credentials: true
	})
)

const userRouter = require('./router/users.js');

try {
	//  mongoose.connect(process.env.DB_URLcardataadmin); //cek di .env
	 mongoose.connect(process.env.DB_URLUSER); //cek di .env
  } catch (error) {
	handleError(error);
  }
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected to mongodb');
});

//cek middleware.js
var myAllowedMethods = (req, res, next) => {
	req.myTime = new Date() //variable middleware
	const allowedMethods = [
		"OPTIONS",
		"HEAD",
		"CONNECT",
		"GET",
		"POST",
		"PUT",
		"DELETE",
		"PATCH",
	  ];
	
	  if (!allowedMethods.includes(req.method)) {
		res.status(405).send(`${req.method} not allowed.`);
	  }
	next(); //next artinya jalankan si perintah utama
}

//middleware ini akan dieksekusi SEBELUM pemanggilan fungsi berjalan
app.use(myAllowedMethods);

//feature parsing data yang masuk
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//feature routing users.js, didalamnya termasuk JWT, login, dll
app.use(userRouter);

// output json atau send yg netral
app.get('/', (req, res) => {
	const kelas = {
		id: 1,
		nama: 'mbang',
		tanggal: req.myTime.toString() //diambil dari variable middleware
	}
	//umumnya pakai res.send(bla bla) yang netral
	res.json(kelas);
});

//html format in response.send
app.get('/main', (req, res) => {
	res.send('<h3>Main games</h3>');
});

//redirect ke path ttt atau url
app.get('/fwd', (req, res) => {
	res.redirect('/main');
	// res.redirect('https://google.com');
});

//listener server
app.listen(3000, function(){
	console.log('server is running');
})