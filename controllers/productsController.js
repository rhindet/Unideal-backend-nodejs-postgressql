
const storage  = require('../utils/cloud_storage');
const asyncForEach  = require('../utils/async_foreach');
const Product = require('../models/product')

module.exports = {

    async findbyCategory(req,res,next){
            try{

                const id_category = req.params.id_category
                const data = await Product.findByCategory(id_category);

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
    async findbyCategoryAndProductName(req,res,next){
        try{

            const id_category = req.params.id_category
            const product_name = req.params.product_name
            const data = await Product.findByCategoryAndProductName(id_category,product_name);

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



    async create(req,res,next){
        let product = JSON.parse(req.body.product);
        const files = req.files;

        let inserts = 0;

        if(files.length === 0){
            return res.status(501).json({
                message:'Error al registrar el producto no tiene imagen',
                success:false
            });
        }else{
            try{
                
                const data = await Product.create(product); //almacenando el producto
                product.id = data.id;
                console.log(`Categorias ${JSON.stringify(data)}`)

                const start = async () => {
                    await asyncForEach(files,async (file) => {
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(file,pathImage);

                        if(url !== undefined && url!=null){
                            if(inserts==0){ //guardo imagen 1
                                    product.image1 = url;
                            }else if(inserts==1){
                                product.image2 = url;
                            }else if(inserts==2){
                                product.image3 = url;
                            }
                        }

                        await Product.update(product);
                        
                        inserts = inserts + 1;

                        if(inserts == files.length){
                            return res.status(201).json({
                                success:true,
                                message:'El producto se ha registrado correctamente'
                            });
                        }
                    });
                }
                start();



            }catch(error){
                console.log(`El error:${error}`);
                return res.status(501).json({
                    message:`Hubo un error al registrar el producto:${error} `,
                    success:false,
                    error:error
                });
            }
        }

    }
}