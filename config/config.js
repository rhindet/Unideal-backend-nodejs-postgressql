

const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query:(e) =>{}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114,function(stringValue){
    return stringValue
});




 //const databaseConfig = {
 //   'host' : 'dpg-cmh0bcnqd2ns73fn68o0-a',
 //   'port':'5432',
 //    'database':'db_unideal',
 //   'user':'rhindet',
 //   'password':'dHIxmlze2DFmPhsEikVBuSF2qdvTWSRB'
 //};

 const databaseConfig = {
    'host' : 'localhost',
     'port':'5432',
    'database':'delivery_db',
     'user':'postgres',
    'password':'1824100bh'
     };


const db = pgp(databaseConfig);
module.exports = db;