

const AddressFirebase = require("../models/address_firebase")


module.exports = {
    async create(req,res,next){
        try{

            const driverInfo = req.body;
            
            const data = await AddressFirebase.create(driverInfo)

            return res.status(201).json({
                message:'Se creo exitosamente la ubicacion',
                success:true,
            });



        }catch(error){
            console.log((`error: ${error}`));
            return res.status(501).json({
                message:'Hubo un error al crear la ubicacion',
                success:false,
                error:error
            });
        }
    },

    
}


