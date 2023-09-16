const express = require('express');
const mongoose = require('mongoose');
const path  = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const multer = require('multer');
const dotenv = require('dotenv').config();

// const MongoClient = require('mongodb').MongoClient;
const userRouters = require("./routes/user");
const giftRouters = require("./routes/gift");


const app = express();
const port  =  process.env.PORT || 9000;
const collection = 'Gift';

// Static file serving
app.use(express.static(path.join(__dirname, 'assets')))

// View engine setup
app.set('View engine','ejs');
app.set('Views',path.join(__dirname,'views'));

// Middleware
var storage = multer.diskStorage({
    destination :path.join(__dirname,'assets/dbImg'),
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(multer({storage,dest:path.join(__dirname,'assets/dbImg')}).single('img'));
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
});

//routes
app.get('/',(req,res) =>{
    path_source = path.join(__dirname ,'/views/index.ejs')
    res.render(path_source, {colorList: {}})
    //res.sendFile(path.join(__dirname ,'/views/index.ejs'));
    //res.sendFile('/views/index.html', { root: __dirname });
});

app.get('/add',(req,res) =>{
    res.sendFile(path.join(__dirname ,'/views/add.html'));
});

app.get('/regalos',(req,res) =>{
    res.sendFile(path.join(__dirname ,'/views/gifts.html'));
});

app.use('/api',userRouters)
app.use('/api',giftRouters)



app.listen(port,() => {
    console.log(`Server listening on port ${port} http://localhost:${port}/`);
});
