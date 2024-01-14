

const crypto = require('crypto')
const db = require('../config/config');

const Restaurant = {};



Restaurant.getRate = (restaurant_id) =>{
    const sql = `  
    SELECT rate from restaurants WHERE restaurant_id = $1
    `;
    return db.oneOrNone(sql,[
        restaurant_id,
    ]);
}

Restaurant.updateRate = (restaurant_id,rate) =>{
    const sql = `  
    UPDATE restaurants
        SET 
        rate = $2
    WHERE restaurant_id = $1
    `;
    return db.none(sql,[
        restaurant_id,
        rate
    ]);
}

Restaurant.updateState = (restaurant_id,state) =>{
    const sql = `  
    UPDATE restaurants
        SET 
        is_available = $2
    WHERE restaurant_id = $1
    `;
    return db.none(sql,[
        restaurant_id,
        state
    ]);
}

Restaurant.getAll = () =>{
    const sql = `SELECT * FROM restaurants
    ORDER BY rate DESC 
    `;
    return db.manyOrNone(sql);
}


Restaurant.getProductsById = (id_restaurant) =>{
    const sql = `
    SELECT products.*
        FROM restaurants
        LEFT JOIN products ON restaurant_id = products.id_restaurant
        WHERE restaurant_id = $1
    ORDER BY products.name; 
    
    `;
    return db.manyOrNone(sql,id_restaurant);
}

Restaurant.getRestaurantById = (user_id) => {
    const sql = `SELECT * FROM restaurants WHERE user_id = $1`;
    return db.oneOrNone(sql,user_id);
}

Restaurant.getRestaurantStatus = (id_restaurant) => {
    const sql = `SELECT is_available FROM restaurants WHERE restaurant_id = $1`;
    return db.oneOrNone(sql,id_restaurant);
}

Restaurant.findRestaurantLike = (product_name) =>{
    console.log(product_name)
    const sql = `
    SELECT
            R.restaurant_id,
            R.name,
            R.user_id,
            R.time_min,
            R.time_max,
            R.banner,
            R.rate,
            R.tarifa,
            R.created_at,
            R.updated_at,
            R.logo,
            R.is_available
        FROM
            restaurants AS R

        WHERE
            R.name ILIKE $1

    `;
    return db.manyOrNone(sql,[`%${product_name}%`]);
}

Restaurant.update = (restaurant) =>{
    const sql = `

        UPDATE restaurants
                SET 
                name = $2,
                tarifa = $3,
                time_min = $4,
                time_max= $5
        WHERE restaurant_id = $1

    `;
    
    return db.none(sql,[
        restaurant.restaurant_id,
        restaurant.name,
        restaurant.tarifa,
        restaurant.time_min,
        restaurant.time_max
    ]);
}

Restaurant.updateImages = (restaurant) => {
    const sql = `
        UPDATE restaurants
        SET 
            banner = COALESCE($2, banner), 
            logo = COALESCE($3, logo)      
        WHERE restaurant_id = $1
    `;
    
    return db.none(sql, [
        restaurant.restaurant_id,
        restaurant.banner,
        restaurant.logo    
    ]);
};


module.exports = Restaurant;