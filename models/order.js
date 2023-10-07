


const db = require('../config/config');

const Order = {};


Order.findByStatus = (status) =>{
    const sql = `
                SELECT
                O.id,
                O.id_client,
                O.id_address,
                O.id_delivery,
                O.status,
                O.timestamp,             
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id' ,P.id,
                        'name' ,P.name,
                        'description' ,P.description,
                        'price' ,P.price,
                        'image1' ,P.image1,
                        'image2' ,P.image2,
                        'image3' ,P.image3,
                        'quantity',OHP.quantity
                    )	
                ) AS products,
                JSON_BUILD_OBJECT(
                    'id',U.id,
                    'name',U.name,
                    'lastname',U.lastname,
                    'image',U.image
                ) AS client,
                JSON_BUILD_OBJECT(
                    'id',U2.id,
                    'name',U2.name,
                    'lastname',U2.lastname,
                    'image',U2.image
                ) AS delivery,
                JSON_BUILD_OBJECT(
                    'id',A.id,
                    'address',A.address,
                    'neighborhood',A.neighborhood,
                    'lat',A.lat,
                    'lng',A.lng
                ) AS address
            FROM
                orders AS O
            INNER JOIN 
                users AS U
            ON 
                O.id_client = U.id
                
            LEFT JOIN
                users AS U2 
            ON 
                O.id_delivery = U2.id
                
            INNER JOIN 
                address AS A 
            ON
                A.id = O.id_address
                
            INNER JOIN 
                order_has_products AS OHP
            ON 
                OHP.id_order = O.id

            INNER JOIN 
                products AS P
            ON 
                P.id = OHP.id_product

            WHERE
                status = $1
            GROUP BY
                O.id,U.id,A.id,U2.id
                            
    
`;

    return db.manyOrNone(sql,status)



}

Order.findByDeliveryAndStatus = (id_delivery,status) =>{
    const sql = `
                SELECT
                O.id,
                O.id_client,
                O.id_address,
                O.id_delivery,
                O.status,
                O.timestamp,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id' ,P.id,
                        'name' ,P.name,
                        'description' ,P.description,
                        'price' ,P.price,
                        'image1' ,P.image1,
                        'image2' ,P.image2,
                        'image3' ,P.image3,
                        'quantity',OHP.quantity
                    )	
                ) AS products,
                JSON_BUILD_OBJECT(
                    'id',U.id,
                    'name',U.name,
                    'lastname',U.lastname,
                    'phone',U.phone,
                    'image',U.image
                ) AS client,
                JSON_BUILD_OBJECT(
                    'id',U2.id,
                    'name',U2.name,
                    'lastname',U2.lastname,
                    'image',U2.image
                ) AS delivery,
                JSON_BUILD_OBJECT(
                    'id',A.id,
                    'address',A.address,
                    'neighborhood',A.neighborhood,
                    'lat',A.lat,
                    'lng',A.lng
                ) AS address
            FROM
                orders AS O
            INNER JOIN 
                users AS U
            ON 
                O.id_client = U.id
                
            LEFT JOIN
                users AS U2 
            ON 
                O.id_delivery = U2.id
                
            INNER JOIN 
                address AS A 
            ON
                A.id = O.id_address
                
            INNER JOIN 
                order_has_products AS OHP
            ON 
                OHP.id_order = O.id

            INNER JOIN 
                products AS P
            ON 
                P.id = OHP.id_product

            WHERE
            O.id_delivery = $1  AND status = $2  
            GROUP BY
                O.id,U.id,A.id,U2.id
                            
    
`;
  
    return db.manyOrNone(sql,[id_delivery,status]);



}

Order.findByClientAndStatus = (id_client,status) =>{

    const sql = `
                SELECT
                O.id,
                O.id_client,
                O.id_address,
                O.id_delivery,
                O.status,
                O.timestamp,
                O.lat,
                O.lng,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id' ,P.id,
                        'name' ,P.name,
                        'description' ,P.description,
                        'price' ,P.price,
                        'image1' ,P.image1,
                        'image2' ,P.image2,
                        'image3' ,P.image3,
                        'quantity',OHP.quantity
                    )	
                ) AS products,
                JSON_BUILD_OBJECT(
                    'id',U.id,
                    'name',U.name,
                    'lastname',U.lastname,
                    'phone',U.phone,
                    'image',U.image
                ) AS client,
                JSON_BUILD_OBJECT(
                    'id',U2.id,
                    'name',U2.name,
                    'lastname',U2.lastname,
                    'image',U2.image
                ) AS delivery,
                JSON_BUILD_OBJECT(
                    'id',A.id,
                    'address',A.address,
                    'neighborhood',A.neighborhood,
                    'lat',A.lat,
                    'lng',A.lng
                ) AS address
            FROM
                orders AS O
            INNER JOIN 
                users AS U
            ON 
                O.id_client = U.id
                
            LEFT JOIN
                users AS U2 
            ON 
                O.id_delivery = U2.id
                
            INNER JOIN 
                address AS A 
            ON
                A.id = O.id_address
                
            INNER JOIN 
                order_has_products AS OHP
            ON 
                OHP.id_order = O.id

            INNER JOIN 
                products AS P
            ON 
                P.id = OHP.id_product

            WHERE
            O.id_client= $1  AND status = $2  
            GROUP BY
                O.id,U.id,A.id,U2.id
                            
    
`;

    return db.manyOrNone(sql,[id_client,status]);



}


Order.create= (orden) => {
    const sql = `
        INSERT INTO 
            orders(
                id_client,
                id_address,
                status,
                timestamp,
                created_at,
                updated_at

            )
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING id
    `;
    return db.oneOrNone(sql,[
        orden.id_client,
        orden.id_address,
        orden.status,
        Date.now(),
        new Date(),
        new Date()
    ])
}

Order.update = (order) => {
    const sql = `
        UPDATE
            orders
        SET
            id_client = $2,
            id_address = $3,
            id_delivery = $4,
            status = $5,
            updated_at = $6
        WHERE 
            id = $1
    `;
    return db.none(sql,[
        order.id,
        order.id_client,
        order.id_address,
        order.id_delivery,
        order.status,
        new Date()
    ]);
},
Order.updateLatLng = (order) => {
    const sql = `
        UPDATE
            orders
        SET
            lat = $2,
            lng = $3
        WHERE 
            id = $1
    `;
    return db.none(sql,[
        order.id,
        order.lat,
        order.lng
    ]);
}


Order.delete = (order) => {
    const sql = `
        DELETE FROM  orders WHERE id = $1
    `;
    return db.none(sql,[
        order,
    ]);
}


module.exports = Order;