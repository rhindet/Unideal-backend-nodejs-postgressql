

const locationFirebase = require('../controllers/locationFirebase')
const passport = require('passport');


module.exports = (app) =>{

    app.post('/api/address_firebase/create',passport.authenticate('jwt',{session:false}),locationFirebase.create);



}