const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
//import jwt from 'jsonwebtoken'; 

const generateToken = (res, name, kode) => {
  const accessToken = jwt.sign({user: name, kode: kode}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
  const refreshToken = jwt.sign({user: name, kode: kode}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '120s'});
//   return {accessToken, refreshToken, name, kode};

  return res.cookie('token', accessToken, {
    expires: dayjs().add(60, "s").toDate(),
    secure: false, // set to true if your using https
    httpOnly: true,
  });
};
module.exports = generateToken