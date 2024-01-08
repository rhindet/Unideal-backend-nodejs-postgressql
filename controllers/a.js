async create(req,res,next){
    let product = JSON.parse(req.body.product);
    const files = req.files;

     console.log(req.body.product)

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
                await asyncForEach(files, async (file, index) => {
                    let imageName;
                    
                    if (file.originalname === 'image1') {
                        imageName = `image1_${product.id_restaurant}_${product.id}`;
                    } else if (file.originalname === 'image2') {
                        imageName = `image2_${product.id_restaurant}_${product.id}`;
                    } else if (file.originalname === 'image3') {
                        imageName = `image3_${product.id_restaurant}_${product.id}`;
                    } 
            
                    const pathImage = `${imageName}`;
                    const url = await storage(file, pathImage);
                  
                    if (url !== undefined && url !== null) {
                        if (file.originalname === 'image1') {
                            product.image1 = url;
                        } else if (file.originalname === 'image2') {
                            product.image2 = url;
                        } 
                        else if (file.originalname === 'image3') {
                            product.image3 = url;
                        } 
                    }
                   
                    await Product.updateImages(product);
            
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
    }

},