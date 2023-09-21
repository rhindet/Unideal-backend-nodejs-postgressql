

const ProductsController = require('../controllers/productsController')
const passport = require('passport')


module.exports = (app,upload) =>{
    app.post('/api/products/create',passport.authenticate('jwt',{session:false}),upload.array('image',3),ProductsController.create);

    app.get('/api/products/findByCategory/:id_category',passport.authenticate('jwt',{session:false}),ProductsController.findbyCategory);

    app.get('/api/products/findByCategoryAndProductName/:id_category/:product_name',passport.authenticate('jwt',{session:false}),ProductsController.findbyCategoryAndProductName);
}