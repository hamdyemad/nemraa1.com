require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const options = { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }
const app = express();
const productRoute = require('./routes/products.route');
const authRoute = require('./routes/auth.route');
const orderRoute = require('./routes/order.route');
const homeRoute = require('./routes/home.route');
const egyptRoute = require('./routes/egypt.route');
const cartRoute = require('./routes/cart.route');
const informatiomRoute = require('./routes/information.route');
const advertisingRoute = require('./routes/advertising.route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})

// routes
app.use(informatiomRoute);
app.use('/products', productRoute);
app.use(authRoute);
app.use('/orders', orderRoute);
app.use(homeRoute)
app.use('/egypt', egyptRoute)
app.use('/cart', cartRoute)
app.use('/advertising', advertisingRoute)



mongoose.connect(process.env.URI, options).then(() => {

    console.log('mongodb connected');
})
    .catch((err) => {
        console.log(err)
    })


app.listen(process.env.PORT, console.log(`server listend at ${process.env.PORT}`))