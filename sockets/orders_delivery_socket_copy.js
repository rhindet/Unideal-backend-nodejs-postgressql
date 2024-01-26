

const AddressFirebase = require("../models/address_firebase")



module.exports = (io) => {
                 const orderDeliveryNameSpace = io.of('/orders/delivery');

                 const driverRooms = new Map();

                // Configuración de sockets
                orderDeliveryNameSpace.on('connection', (socket) => {
                    console.log(`Cliente conectado: ${socket.id}`);

                        // Cuando un conductor se conecta
                        socket.on('driverConnect', (driver) => {
                            console.log(`Conductor ${driver.id_driver} se ha conectado`);
                            
                            // Crea una sala para el conductor y agrégalo a ella
                            const driverRoom = `driverRoom_${driver.id_driver}`;
                            
                            socket.join(driverRoom);

                            // Almacena la sala del conductor en el mapa
                            driverRooms.set(driver.id_driver, driverRoom);
                        });

                // Cuando un cliente se conecta y desea seguir a un conductor
                socket.on('clientConnect', (data) => {


                    console.log(`Cliente ${data.id_client} se ha conectado y sigue al conductor ${data.id_driver}`);
           
                    // Obtiene la sala del conductor al que sigue el cliente
                    const driverRoom = driverRooms.get(data.id_driver);

                    // Agrégalo a la sala correspondiente
                    if (driverRoom) {
                        socket.join(driverRoom);
                    }
                });

                // Manejar eventos personalizados aquí
                socket.on('position', (data) => {
                    console.log(`EMITIO ${JSON.stringify(data)}`);
                    orderDeliveryNameSpace.emit(`position/${data.id_driver}`,{lat:data.lat,lng:data.lng});
                   
                });

                socket.on('updateStatus', (data) => {
                    orderDeliveryNameSpace.emit('updateStatus', { status: data.status });
                    console.log('entro al updatestatus') 
                  });

    

                  socket.on('updateStatus2', (data) => {
                    console.log(data);
                    orderDeliveryNameSpace.emit(`updateStatus2/${data.userId}`, { status: data.status });
            
                  }); 

                  socket.on('updateStatusToRestaurant', (data) => {
                    console.log(data)
                    orderDeliveryNameSpace.emit(`updateStatusToRestaurant/${data.restaurantId}`, { status: data.status });
            
                  }); 

                   // Manejar eventos personalizados aquí
                socket.on('rate', (data) => {
                    console.log(`EMITIO a rate${JSON.stringify(data)}`);
                    orderDeliveryNameSpace.emit(`rate/${data.userId}`,{
                        restaurant:data.restaurant});
                   
                });

        
                socket.on('disconnect', () => {
                        console.log(`Cliente desconectado: ${socket.id}`);
                        
                        // Lógica para eliminar al cliente de las salas correspondientes
                        // Esto depende de tu implementación específica
                    }); 
         });

}
