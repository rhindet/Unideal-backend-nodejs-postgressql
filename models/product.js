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

Product.delete= (id_product) =>{
    const sql = `
        delete  from products  WHERE id = $1
    `;
    return db.none(sql,id_product);
}


Product.IncrementInventory = (numero, order) => {
 
    var nuevoInventario = order.quantity + numero
    
    const sql = ` 
            UPDATE 
                products
            SET 
                inventory = $2,
                is_available = true,
                updated_at = $3
            WHERE 
                id = $1
`;

    return db.none(sql,[
        order.id, 
        nuevoInventario,   
        new Date()
    ]);


}

Product.inventoryReduce = (inv,product_id,product_quantity) => {
      
        

        let nuevoInventario = inv - product_quantity

        // Verificar si el inventario es menor que 0
        if (nuevoInventario < 0) {
            throw new Error('No hay suficiente inventario para este producto');
        }

        if(nuevoInventario === 0){
            console.log('dadadas')
                const sql = ` 
                UPDATE products
                SET  is_available = false
                WHERE id = $1
                `;
                db.none(sql,[
                    product_id, 
                ]);
        }

        
        const sql = ` 
                UPDATE 
                    products
                SET 
                    inventory = $2,
                    updated_at = $3
                WHERE 
                    id = $1
        `;
        return db.none(sql,[
            product_id, 
            nuevoInventario,   
            new Date()
        ]);
}




Product.findByCategoryAndProductName = (id_category,product_name) =>{
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
        discount,
        inventory,
        image1,
        image2,
        image3,
        id_category,
        id_user,
        id_restaurant,
        created_at,
        updated_at
        
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id
    `;
    return db.oneOrNone(sql,[
        producto.name,
        producto.description,
        producto.price,
        producto.discount,
        producto.inventory,
        producto.image1,
        producto.image2,
        producto.image3,
        producto.id_category,
        producto.id_user,
        producto.id_restaurant,
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

Product.getInventory = (product_id) => {
    
    const sql = `
        SELECT inventory
        FROM products 
        WHERE id = $1
        `;
        return db.oneOrNone(sql, product_id
        );

}

Product.updateImages = (product) => {
    
    const sql = `
        UPDATE products
        SET 
            image1 = COALESCE($2, image1), 
            image2 =  COALESCE($3, image2),
            image3 =  COALESCE($4, image3)         
        WHERE id = $1
    `;
    
    return db.none(sql, [
        product.id,
        product.image1,
        product.image2    ,
        product.image3    ,
    ]);
};


Product.update2 = (producto) => {
       

    const sql = `
        UPDATE 
            products
        SET 
            name = $2,
            description = $3,
            price = $4,
            discount = $5,
            inventory = $6,
            is_available = $7 ,
            id_category = $8,
            updated_at=$9
        
        WHERE 
        id = $1

    `;
    return db.none(sql,[
        producto.id, 
        producto.name,
        producto.description,
        producto.price,
        producto.discount,
        producto.inventory,
        producto.is_available,
        producto.id_category,
        new Date()
    ]);


   

}






module.exports = Product;