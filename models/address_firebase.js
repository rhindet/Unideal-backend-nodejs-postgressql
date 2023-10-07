const db = require('../config/config_firebase');

const AddressFirebase = {};

AddressFirebase.create = (location) => { 
    const driver = `driver${location.id_driver}`;
    

    // Obtén el número actual de ubicaciones para el conductor
    db.ref(`drivers/${driver}/locations`).once('value')
    .then((snapshot) => {


        const locationCount = snapshot.numChildren() + 1; // Incrementa el número de ubicaciones
        
        const locationName = `location${locationCount}`;
        
        // Actualiza la ubicación del conductor con el nombre de la ubicación incremental
        db.ref(`drivers/${driver}/locations/${locationName}`).update({
            latitude: location.lat,
            longitude: location.lng,
        });
    });
};

module.exports = AddressFirebase;
