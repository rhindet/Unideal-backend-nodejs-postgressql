module.exports = (io) => {

    const orderDeliveryNameSpace = io.of('/orders/delivery');

    orderDeliveryNameSpace.on('connection',function(socket){
        console.log('USUARIO CONECTADO AL NAMESPACE /orders/delivery');

        socket.on('position', function(data) {
          console.log(`EMITIO ${JSON.stringify(data)}`);
          orderDeliveryNameSpace.emit(`position/${data.id_order}`, { lat: data.lat, lng: data.lng });
        });

        socket.on('disconnect',function(data){
            console.log('USUARIO DESCONECTADO');
        });
    })

}