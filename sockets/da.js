

const AddressFirebase = require("../models/address_firebase")



module.exports = (io) => {
    const orderDeliveryNameSpace = io.of('/orders/delivery');

    // Objeto para almacenar la última ubicación conocida del delivery por pedido
    const connectedSocketIds = [];

    orderDeliveryNameSpace.on('connection', function(socket) {
        console.log('USUARIO CONECTADO AL NAMESPACE /orders/delivery');
        console.log(`Bienvenido ${socket.id}`)
        
        socket.on('joinDeliveryRoom', function(data) {
         
            // Unirse a una sala (room) específica basada en el ID del pedido
            const roomName = `deliveryRoom_${data.id_order}`;
            socket.join(roomName);
          
        
            // Limpia los oyentes anteriores para evitar duplicados
           // socket.removeAllListeners('position');


            const socketInfo = { id: socket.id, type: data.type };
            connectedSocketIds.push(socketInfo);
            console.log(connectedSocketIds)

            socket.on('position', async function(data2) {
                const orderId = data2.id_order;
                // Emitir la ubicación solo a la sala específica
                orderDeliveryNameSpace.to(roomName).emit(`position/${data2.id_order}`, { lat: data2.lat, lng: data2.lng });

            
                await AddressFirebase.create(data2)

                console.log(`lat: ${data2.lat}, lng: ${data2.lng}`)
            });

            socket.on('disconnect', function() {
                console.log(`Adios ${socket.id}`)
                // Dejar la sala cuando el usuario se desconecta
                socket.leave(roomName);
               
            });

            socket.on('delete', function() {


                const socketsOfTypeDelivery = connectedSocketIds.filter((socketInfo) => socketInfo.type === 'delivery');
               
                socketsOfTypeDelivery.forEach((socketInfo) => {
                    const socketId = socketInfo.id;
                    console.log(`Desconectando socket: ${socketId}`);
                    const socket = orderDeliveryNameSpace.connected[socketId];
                    if (socket) {
                        socket.disconnect(true); // Desconectar el socket
                    }
                });

                
               
            });


        });
    });
}