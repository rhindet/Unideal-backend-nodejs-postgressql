

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

const databaseConfig = {
    'host' : 'dpg-ckgf3rmafg7c73c92ml0-a',
    'port':'5432',
    'database':'delivery_db_nf7g',
    'user':'rhindet',
    'password':'6vBCUeiW8Ng18jTow7mEh23wj2jn6Vgh'
};

const db = pgp(databaseConfig);
module.exports = db;