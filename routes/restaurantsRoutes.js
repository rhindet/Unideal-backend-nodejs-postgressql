
const RestaurantController = require('../controllers/restaurantsController')
const passport = require('passport');


module.exports = (app,upload) =>{
    app.get(`/api/restaurants/getAll`,RestaurantController.getAll);

    app.get(`/api/restaurants/getById/:id_restaurant`,passport.authenticate('jwt',{session:false}) , RestaurantController.getById);
    
    app.get(`/api/restaurants/getRestaurantByUserId/:user_id`,passport.authenticate('jwt',{session:false}) , RestaurantController.getRestaurantByUserId);

    app.get('/api/restaurants/findRestaurantLike/:product_name',passport.authenticate('jwt',{session:false}),RestaurantController.findRestaurantLike);
    
    app.put('/api/restaurants/updateProfile',passport.authenticate('jwt',{session:false}),upload.array('image',2),RestaurantController.updateProfile);

    app.put('/api/restaurants/updateRate/:newRate/:restaurant',passport.authenticate('jwt',{session:false}),RestaurantController.updateRate);
}