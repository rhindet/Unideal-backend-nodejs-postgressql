

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan')
const cors = require('cors')
const multer = require('multer')

const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
const users = require('./routes/usersRoutes');
const keys = require('./config/keys');
const categoriesRoutes = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const AddressFirebase = require('./routes/addressFirebaseRoutes');
const orders = require('./routes/ordersRoutes');
const io = require('socket.io')(server);

const orderDeliverySocket = require('./sockets/orders_delivery_socket');



const upload = multer({
    storage:multer.memoryStorage()
})





const port = process.env.PORT || 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cors());
app.use(require('express-session')({ 
    secret: keys.secretOrKey,
    resave: true,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport)

app.disable('x-powred-by');

/*
*Rutas

*/



app.set('port',port);



orderDeliverySocket(io);


/*
*Llamando a las Rutas

*/
users(app,upload)
categoriesRoutes(app);
products(app,upload)
address(app)
orders(app)
AddressFirebase(app)

server.listen(3000,'192.168.0.4'||'localhost',function(){
    console.log('Aplicacion de nodejs '+port+' Iniciada...')
});


//ERROR HANDLER
app.use((err,req,res,next) =>{
    console.log(err);
    res.status(err.status||500).send(err.status);
})


module.exports = {
    app:app,
    server:server
}