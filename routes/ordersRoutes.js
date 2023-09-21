

const OrderController = require('../controllers/ordersController')
const passport = require('passport');
const Order = require('../models/order');


module.exports = (app) =>{

    app.post('/api/orders/create',passport.authenticate('jwt',{session:false}),OrderController.create);

    app.get('/api/orders/findByStatus/:status',passport.authenticate('jwt',{session:false}),OrderController.findByStatus);

    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status',passport.authenticate('jwt',{session:false}),OrderController.findByDeliveryAndStatus);

    app.get('/api/orders/findByClientAndStatus/:id_client/:status',passport.authenticate('jwt',{session:false}),OrderController.findByClientAndStatus);
    
    
    app.put('/api/orders/updateToDispatched',passport.authenticate('jwt',{session:false}),OrderController.updateToDispatched);

    app.put('/api/orders/updateToOnTheWay',passport.authenticate('jwt',{session:false}),OrderController.updateToOnTheWay);


    app.put('/api/orders/updateToDelivered',passport.authenticate('jwt',{session:false}),OrderController.updateToDelivered);

    app.put('/api/orders/updateLatLng',passport.authenticate('jwt',{session:false}),OrderController.updateLatLng);
}