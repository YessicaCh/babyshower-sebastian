const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const userRouters = require("./routes/user");
const giftRouters = require("./routes/gift");
const morgan = require('morgan');
const multer = require('multer');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;
const collection = 'Gift';

// Static file serving
app.use(express.static(path.join(__dirname, 'assets')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'assets/dbImg'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage }).single('img'));
app.use(morgan('dev'));
//app.use(express.static(__dirname + '/public'));

// MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
//     if (err) return console.log('Error: ' + err);
//     var db = client.db('myFirstDatabase')
// })


// app.use(multer({ dest: ´./uploads/´,
//  rename: function (fieldname, filename) {
//    return filename;
//  },
// }));



// mongoose.connect(process.env.MONGODB_URI).then(()=>{
//     console.log('conect DB');
// }).catch((error)=>{console.log(error)})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });

// Routes
app.get('/', (req, res) => {
    res.render('index', { colorList: {} });
});

app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/add.html'));
});

app.get('/regalos', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/gifts.html'));
});

app.use('/api', userRouters);
app.use('/api', giftRouters);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
