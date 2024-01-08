

const  keys  = require('../config/keys');
const Restaurant = require('../models/restaurants')
const Rol = require('../models/rol');
const storage  = require('../utils/cloud_storage');
const asyncForEach  = require('../utils/async_foreach');


module.exports = {
    async getAll(req,res,next){
        try{
            const data = await Restaurant.getAll();
            console.log(`Restaurant: ${data[0]}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    success:false,
                    message:'Error al obtener los restaurantes'
                }
            );
        }

    },

    async getById(req,res,next){
        try{
            const id_restaurant = req.params.id_restaurant
         
            const data = await Restaurant.getProductsById(id_restaurant);
            console.log(`Restaurant: ${data[0]}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    success:false,
                    message:'Error al obtener los restaurantes'
                }
            );
        }

    },
    async getRestaurantByUserId(req,res,next){
        try{
            const user_id = req.params.user_id
            const data = await Restaurant.getRestaurantById(user_id);
            console.log(`Restaurant: ${data[0]}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    success:false,
                    message:'Error al obtener los restaurantes'
                }
            );
        }

    },
    async updateRate(req,res,next){
        try{
            const newRate = parseFloat(req.params.newRate);
            const restaurant = req.params.restaurant
            const data = await Restaurant.getRate(restaurant);
            var newData = parseFloat(data.rate);
            var finalRate = (newData + newRate) / 2;  
            finalRate = finalRate.toFixed(1);
            

            await Restaurant.updateRate(restaurant,finalRate);
            return res.status(201).json(
                {
                    success:true,
                    message:'Se califico correctamente'
                }
            );
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    success:false,
                    message:'Error al obtener los restaurantes'
                }
            );
        }

    },
    async findRestaurantLike(req,res,next){
        try{
            console.log("product_name")
            const product_name = req.params.product_name
         
            const data = await Restaurant.findRestaurantLike(product_name);

            return res.status(201).json(data)
            
        }catch(error){
            console.log(`El error:${error}`);
            return res.status(501).json({
                message:`Error al listar los productos por categoria `,
                success:false,
                error:error
            });
        }
},

async updateProfile(req,res,next){
    let restaurant = JSON.parse(req.body.restaurant);
    const files = req.files;
    
   

    let inserts = 0;
 
        try{
            
            const data = await Restaurant.update(restaurant); //almacenando el producto
            
            const start = async () => {
                await asyncForEach(files, async (file, index) => {
                    let imageName;
                    
                    if (file.originalname === 'image1') {
                        imageName = `banner_${restaurant.restaurant_id}`;
                    } else if (file.originalname === 'image2') {
                        imageName = `logo_${restaurant.restaurant_id}`;
                    } 
            
                    const pathImage = `${imageName}`;
                    const url = await storage(file, pathImage);
                  
                    if (url !== undefined && url !== null) {
                        if (file.originalname === 'image1') {
                            restaurant.banner = url;
                        } else if (file.originalname === 'image2') {
                            restaurant.logo = url;
                        } 
                    }
                   
                    await Restaurant.updateImages(restaurant);
            
                    inserts = inserts + 1;
            
                    if (inserts === files.length) {
                        return res.status(201).json({"success": true, "message": "Se editó correctamente"});
                    }
                });
            };
            
            if (files !== null && files.length !== 0  ) {
                start()
            }else{
                return res.status(201).json({"success": true, "message": "Se editó correctamente"});
            }

            



        }catch(error){
            console.log(`El error:${error}`);
            return res.status(501).json({
                message:`Hubo un error al registrar el producto:${error} `,
                success:false,
                error:error
            });
        }
    

},


}