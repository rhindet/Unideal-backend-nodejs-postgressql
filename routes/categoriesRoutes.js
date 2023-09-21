

const CategoriesController = require('../controllers/categoriesController')
const passport = require('passport');


module.exports = (app) =>{

    app.post('/api/categories/create',passport.authenticate('jwt',{session:false}),CategoriesController.create);

    app.get('/api/categories/getAll',passport.authenticate('jwt',{session:false}),CategoriesController.getAll);



}