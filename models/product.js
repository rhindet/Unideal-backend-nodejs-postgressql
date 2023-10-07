const db = require('../config/config');


const Product = {};

Product.findByCategory= (id_category) =>{
    const sql = `
        SELECT
            P.id,
            P.name,
            P.description,
            P.price,
            P.image1,
            P.image2,
            P.image3,
            P.id_category,
            P.id_user
          
        FROM
            products AS P
        INNER JOIN
            categories AS C
        ON
            P.id_category = C.id
        WHERE
            C.id = $1

    `;
    console.log(id_category)
    return db.manyOrNone(sql,id_category);
}


Product.findByCategoryAndProductName= (id_category,product_name) =>{
    const sql = `
        SELECT
            P.id,
            P.name,
            P.description,
            P.price,
            P.image1,
            P.image2,
            P.image3,
            P.id_category
        FROM
            products AS P
        INNER JOIN
            categories AS C
        ON
            P.id_category = C.id
        WHERE
            C.id = $1 AND P.name ILIKE $2

    `;
    return db.manyOrNone(sql,[id_category,`%${product_name}%`]);
}


Product.create = (producto) => {
    const sql = `INSERT INTO products(
        name,
        description,
        price,
        image1,
        image2,
        image3,
        id_category,
        id_user,
        created_at,
        updated_at
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
    `;
    return db.oneOrNone(sql,[
        producto.name,
        producto.description,
        producto.price,
        producto.image1,
        producto.image2,
        producto.image3,
        producto.id_category,
        producto.id_user,
        new Date(),
        new Date()
    ]);
}

Product.update = (producto) => {
    const sql = `
        UPDATE 
            products
        SET 
            name = $2 ,
            description = $3,
            price = $4 ,
            image1 = $5 ,
            image2 = $6 ,
            image3 = $7 ,
            id_category = $8,
            id_user = $9,
            updated_at = $10
        WHERE 
        id = $1

    `;
    return db.none(sql,[
        producto.id, 
        producto.name  ,
        producto.description ,
        producto.price  ,
        producto.image1  ,
        producto.image2  ,
        producto.image3  ,
        producto.id_category ,
        producto.id_user ,
        new Date()
    ]);
}






module.exports = Product;