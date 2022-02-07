require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(
	cors({
		origin: 'http://localhost:8080', //only allows specific url with port
		// origin: '*', //allows to all urls
		methods:["GET", "POST","DELETE", "PUT"], //dah ga berlaku
		credentials: true
	})
)

const userRouter = require('./router/users.js');

//connect to mongodb
mongoose.connect(process.env.DB_URL); //dipindah ke dotenv
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected to mongodb');
});

//cek middleware.js
var myLogger = (req, res, next) => {
	// console.log('logged');
	req.myTime = new Date() //variable middleware
	next(); //next artinya jalankan si perintah utama
}

//middleware ini akan dieksekusi SEBELUM pemanggilan fungsi berjalan
app.use(myLogger);

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