
const UsersController = require('../controllers/usersController')
const passport = require('passport');


module.exports = (app,upload) =>{
    app.get(`/api/users/getAll`,UsersController.getAll);

    app.get(`/api/users/findById/:id`,passport.authenticate('jwt',{session:false}) , UsersController.findById);

    app.get(`/api/users/findDeliveryMen`,passport.authenticate('jwt',{session:false}) , UsersController.findDeliveryMen);

    app.post('/api/users/create',upload.array('image',1),UsersController.registerWithImage);

    app.post('/api/users/login',UsersController.login);

    app.get('/api/users/recoverySendEmail/:email',UsersController.RecoveryfindEmail);

    app.get('/api/users/verifyRecoveryToken/:email',UsersController.verifyRecoveryToken);

    app.post('/api/users/logout',UsersController.logout);

    app.post('/api/users/sendForm/:id_user',passport.authenticate('jwt',{session:false}),UsersController.sendForm);
 
    app.put('/api/users/update',passport.authenticate('jwt',{session:false}),upload.array('image',1),UsersController.update);

    app.put('/api/users/updatePassword',UsersController.updatePassword);

    app.get('/api/users/deleteToken/:token',UsersController.deleteRecoveryToken);
   

    


}