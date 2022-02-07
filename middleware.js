const express = require('express');
const app = express();

//ini middleware yang SELALU DIEKSEKUSI SETIAP KALI SEBUAH FUNGSI di panggil
function main_middleware(req, res, next){
    console.log('main middleware before 1', req.originalUrl);
    req.myTime = new Date(); //deklarasi variable middleware
    next(); //mengeksekusi URL dalam hal ini / atau /?admin=true atau /users
    console.log('main middleware after 2')
}

//ini middleware juga, diletakkan ditengah antara req, res
//app.get('/', auth, (req, res) => {
function auth(req, res, next){
    console.log('auth middleware 3');
    //gunakan URL: http://localhost:3000/?admin=true
    if(req.query.admin === 'true'){
    // req.myTime = new Date();
    next();
    return;
    }else{
        res.send('No auth');
    }
}

app.use(main_middleware);

app.get('/', auth, (req, res) => {
    res.send(`<h2>Home Page</h2><br>${req.myTime}`)
})

app.get('/users', (req, res) => {
    res.send('User page')
})


app.listen(3000);
