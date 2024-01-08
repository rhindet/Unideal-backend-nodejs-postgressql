


const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const Product = require('../models/product');

module.exports={

    async create(req,res,next){
        try{

            let order = req.body;
            
            
            for(const product of order.products){
                var inventario = await Product.getInventory(product.id) 
                var inv = parseInt(inventario.inventory)
           
                if(inv < product.quantity){
                    throw new Error("Inventario insuficiente"); 
                }

            }

            order.status = 'EN ESPERA';
            const data = await Order.create(order);


            //Recorrer todos los productos agregados a la order
            for(const product of order.products){
                var inventario = await Product.getInventory(product.id) 
                var inv = parseInt(inventario.inventory)
                await OrderHasProducts.create(data.id,product.id,product.quantity);
                await Product.inventoryReduce(inv,product.id,product.quantity);    
            }



            return res.status(201).json({
                success:true,
                message:'La orden se creo correctamente',
                data:data.id
          })   


        }catch(error){
              console.log(`El error ${error}`);
              return res.status(501).json({
                    success:false,
                    message:'Hubo un error creando la orden'
                    
              })      
        }
    },
    async findByStatus(req,res,next){
        try {
            const status = req.params.status
            const data = await Order.findByStatus(status);

            return res.status(201).json(data); 


        } catch (error) {
            console.log(`Error ${error}`)
            return res.status(501).json({
                message:'Hubo un error al tratar de obtener las ordenes por status',
                error:error,
                success:false
            })
        }
    },
    async findByDeliveryAndStatus(req,res,next){
        try {
            const id_delivery = req.params.id_delivery
            
            const status = req.params.status
            const data = await Order.findByDeliveryAndStatus(id_delivery,status);
        
            return res.status(201).json(data); 


        } catch (error) {
            console.log(`Error ${error}`)
            return res.status(501).json({
                message:'Hubo un error al tratar de obtener las ordenes por status',
                error:error,
                success:false
            })
        }
    },

    async getByStatusAndRestaurant(req,res,next){
        try {
            const id = req.params.id_restaurant
            const status = req.params.status
            const data = await Order.getByStatusAndRestaurant(id,status);
        
            return res.status(201).json(data); 


        } catch (error) {
            console.log(`Error ${error}`)
            return res.status(501).json({
                message:'Hubo un error al tratar de obtener las ordenes por status',
                error:error,
                success:false
            })
        }
    }, 
    async findByClientAndStatus(req,res,next){
        try {
            const id_client= req.params.id_client
            const status = req.params.status
            const data = await Order.findByClientAndStatus(id_client,status);
           
            return res.status(201).json(data); 


        } catch (error) {
            console.log(`Error ${error}`)
            return res.status(501).json({
                message:'Hubo un error al tratar de obtener las ordenes por status',
                error:error,
                success:false
            })
        }
    },
    async updateToDispatched(req,res,next){
        try{

            let order = req.body;
           

            order.status = 'DESPACHADO';
             await Order.update(order);
            

            return res.status(201).json({
                success:true,
                message:'La orden se actualizo correctamente',
               
        })   


        }catch(error){
            console.log(`El error ${error}`);
            return res.status(501).json({
                    success:false,
                    message:'Hubo un error al actualizar la orden',
                    error:error
            })      
        }
    },
    async updateToOnTheWay(req,res,next){
        try{

            let order = req.body;
            
            order.status = 'EN CAMINO';
            
             await Order.update(order);
            

            return res.status(201).json({
                success:true,
                message:'La orden se actualizo correctamente',
               
        })   


        }catch(error){
            console.log(`El error ${error}`);
            return res.status(501).json({
                    success:false,
                    message:'Hubo un error al actualizar la orden',
                    error:error
            })      
        }
    },
    async updateToCancel(req,res,next){
        try{

            let order = req.body;
            console.log(order)
            order.status = 'CANCELADO';
            for(const product of order.products){
               
                var inventario = await Product.getInventory(product.id) 
                let numero = parseInt(inventario.inventory, 10);
    
                await Product.IncrementInventory(numero,product)
            }
             
            
             await Order.update(order);
            
            

            return res.status(201).json({
                success:true,
                message:'La orden se actualizo correctamente',
               
        })   


        }catch(error){
            console.log(`El error ${error}`);
            return res.status(501).json({
                    success:false,
                    message:'Hubo un error al actualizar la orden',
                    error:error
            })      
        }
    },
    async updateToDelivered(req,res,next){
        try{

            let order = req.body;
            order.status = 'ENTREGADO';
             await Order.update(order);
            

            return res.status(201).json({
                success:true,
                message:'La orden se actualizo correctamente',
               
        })   


        }catch(error){
            console.log(`El error ${error}`);
            return res.status(501).json({
                    success:false,
                    message:'Hubo un error al actualizar la orden',
                    error:error
            })      
        }
    },
    async updateLatLng(req,res,next){
        try{

            let order = req.body;

             await Order.updateLatLng(order);
            

            return res.status(201).json({
                success:true,
                message:'La orden se actualizo correctamente',
               
        })   


        }catch(error){
            console.log(`El error ${error}`);
            return res.status(501).json({
                    success:false,
                    message:'Hubo un error al actualizar la orden',
                    error:error
            })      
        }
    },
    async deleteOrder(req,res,next){
        try{

            const id_order= req.params.id_order

            await Order.delete(id_order);
            

            return res.status(201).json({
                success:true,
                message:'La orden se elimino correctamente',
               
        })   


        }catch(error){
            console.log(`El error ${error}`);
            return res.status(501).json({
                    success:false,
                    message:'Hubo un error al eliminar la orden',
                    error:error
            })      
        }
    },
    
    

}