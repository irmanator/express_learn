//expressjs auth function as middleware
const express = require('express');
const app = express();

//create jwt authentication middleware
const auth = require('../middleware/auth.js');
    
