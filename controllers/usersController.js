

const  jwt  = require('jsonwebtoken');
const  keys  = require('../config/keys');
const User = require('../models/user')
const Rol = require('../models/rol');
const storage  = require('../utils/cloud_storage');



module.exports = {
    async getAll(req,res,next){
        try{
            const data = await User.getAll();
            console.log(`Users: ${data}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    success:false,
                    message:'Error al obtener los usuarios'
                }
            );
        }

    },

    async deleteRecoveryToken(req,res,next){
        try{
            const token = req.params.token
            const decoded = jwt.decode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp < currentTime) {
                // El token ha expirado
                return res.status(501).json(
                    {
                        success:false,
                        message:'Token ha expirado'
                    }
                );
              } else {
                await User.deleteRecoveryToken(token);
         
                return res.status(201).json(
                    {
                        success:true,
                        message:'Se actualizo correctamente'
                    }
                );
              }

            
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    success:false,
                    message:'Token no valido'
                }
            );
        }

    },
    async sendForm(req,res,next){
        try{
            const userId = req.params.id_user
            const formulario = req.body;
            
            await User.sendForm(userId,formulario) 

            return res.status(201).json(
                {
                    success:true,
                    message:'Se envio correctamente'
                }
            );
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    success:false,
                    message:'Error al enviar el formulario'
                }
            );
        }

    },
    async findById(req,res,next){
        try{
            const id = req.params.id
            const data = await User.findByUserId(id);
            console.log(`Usuario: ${data}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    success:false,
                    message:'Error al obtener el usuario por id'
                }
            );
        }

    },
    async findDeliveryMen(req,res,next){
        try{

            const data = await User.findDeliveryMen();
            console.log(`Repartidores: ${data}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    success:false,
                    message:'Error al obtener lso repartidores'
                }
            );
        }

    },

    async register(req,res,next){
        try {
             const user = req.body;
             const data = await User.create(user);

             await Rol.create(data.id,1); //ROL POR DEFECTO (CLIENTE)

             return res.status(201).json({
                success:true,
                message:'El registro se realizo correctamente , ahora inicia sesion',
                data:data.id
             })


            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Hubo un error con el registro del usuario',
                error:error
            })
        }
    },
    async registerWithImage(req,res,next){
        try {
             const user = JSON.parse(req.body.user);

             
             
             const files =  req.files;
             if(files.length > 0){ 
                const pathImage =  `image_profile_${user.email}`
                const url = await storage(files[0],pathImage);
                if(url != undefined && url != null){
                    user.image = url
                }
             }
 
             const data = await User.create(user);
             await Rol.create(data.id,1); //ROL POR DEFECTO (CLIENTE)
             
             return res.status(201).json({
                success:true,
                message:'El registro se realizo correctamente , ahora inicia sesion',
                data:data.id
             })
             

            
        } catch (error) {
            console.log(error.constraint);
            if(error.constraint === 'users_email_key'){
                return res.status(501).json({
                    success:false,
                    message:'Email ya existe',
                    error:error.constraint
                })
            }
            if(error.constraint==='users_phone_key' ){
                return res.status(501).json({
                    success:false,
                    message:'El telefono ya existe',
                    error:error.constraint
                })
            }
            
            else{
                return res.status(501).json({
                    success:false,
                    message:'Hubo un error con el registro del usuario',
                   
                })
            }
           
        }
    },

    async updatePassword(req,res,next){
        try {

            const email = req.body.email;
            const password = req.body.password
            
            await User.RecoveryPassword(email,password);
            await User.updateTokenByEmail(email,null)
            return res.status(201).json({
                success:true,
                message:'Se cambio correctamente la contraseña',
             })
            
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Hubo un error con el registro del usuario',
                error:error
            })
        }
    },

    async update(req,res,next){
        try {
             const user = JSON.parse(req.body.user);

             const files =  req.files;

             if(files.length > 0){
                const pathImage = `image_profile_${user.email}`
                const url = await storage(files[0],pathImage);
                if(url != undefined && url != null){
                    user.image = url
                }
             }

             await User.update(user);

            

             return res.status(201).json({
                success:true,
                message:'Los datos del usuario se actualizarion correctamente',
               
             })
            
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Hubo un error con la actualziacion de datos del usuario',
                error:error
            })
        }
    },

    async login(req,res,next){
        try{
                const email = req.body.email;
                const password = req.body.password;


                const myUser = await User.findByEmail(email);


                    
                if(!myUser){
                    return res.status(401).json({
                        success:false,
                        message:'Email y/o contraseña incorrecta'
                    })   
                
                }


            
                if(myUser.session_token !== null ){
                    return res.status(401).json({
                        success:false,
                        message:'Ya hay una sesion iniciada'
                    })  
                }
                
                

                if(User.isPasswordMatched(password,myUser.password)){
                    const token = jwt.sign({id:myUser.id,email:myUser.email},keys.secretOrKey,{
                         expiresIn:(3600) //1 hora expira
                        
                    });
                
               
                 
                
                    const data = {
                            id:myUser.id,
                            name:myUser.name,
                            lastname:myUser.lastname,
                            email:myUser.email,
                            phone:myUser.phone,
                            image:myUser.image,
                            session_token:`JWT ${token}`,
                            roles:myUser.roles

                    }
                    
                    await User.updateToken(myUser.id,`JWT ${token}`)

                    return res.status(201).json({
                            success:true,
                            data:data,
                            message:'El usuario ha sido autenticado'
                    })
                }
                else{
                    return res.status(401).json({
                            success:false,
                            message:'Email y/o contraseña incorrecta',
                    
                    })
                 }
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Error al momento de hacer login',
                error:error
            });
        }
    },
    async logout(req,res,next){
        try{
            const id = req.body.id;
            await User.updateToken(id,null)
            return res.status(201).json({
                success:true,
                message:'La sesion del usuario se ha cerrado correctamente'
        })
        }catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Error al momento de cerrar sesion',
                error:error
            });
        }
    },
    async RecoveryfindEmail(req,res,next){
        try{
            const email = req.params.email;
            const myUser = await User.findEmailToRecovery(email);

            if(!myUser.exists){
                return res.status(501).json({
                    success:false,
                    message:'Email no encontrado',
                    
             });
            }

            const token = jwt.sign({emails:email},keys.secretOrKey,{
                expiresIn: 900  //1 hora expira
               
           });

            await User.updateRecoveryToken(email,token);
           
            await User.sendEmail(email,token);

            return res.status(201).json({
                success:true,
                data:myUser.exists,
                message:'Email encontrado'
        })
        }catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'El usaurio no existe',
                error:error
            });
        }
    },
    async verifyRecoveryToken(req,res,next){
        try{
            const email = req.params.email;
            const verified = await User.verifyRecoveryToken(email)

            if(verified.recovery_token !== null){
                return res.status(501).json({
                    success:false,
                    message:'Email aún no verificado'
                })
            }   

            return res.status(201).json({
                success:true,
                data:verified.recovery_token,
                message:'Se verifico correctamente'
        })
        }catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Hubo un error en el serivdor',
                error:error
            });
        }
    }
}