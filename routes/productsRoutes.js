

const ProductsController = require('../controllers/productsController')
const passport = require('passport')


module.exports = (app,upload) =>{
    app.post('/api/products/create',passport.authenticate('jwt',{session:false}),upload.array('image',3),ProductsController.create);

    app.put('/api/products/update',passport.authenticate('jwt',{session:false}),upload.array('image',3),ProductsController.update);

    app.delete('/api/products/deleteProduct/:id_product',passport.authenticate('jwt',{session:false}),ProductsController.deleteProduct);

    app.get('/api/products/findByCategory/:id_category',passport.authenticate('jwt',{session:false}),ProductsController.findbyCategory);

    app.get('/api/products/findByCategoryAndProductName/:id_category/:product_name',passport.authenticate('jwt',{session:false}),ProductsController.findbyCategoryAndProductName);
}