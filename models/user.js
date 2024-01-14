
const crypto = require('crypto')
const db = require('../config/config');
const nodemailer = require("nodemailer");

const User = {};

User.getAll = () =>{
    const sql = `SELECT * FROM users`;
    return db.manyOrNone(sql);
}

User.sendForm = (userId,formulario) => {
    const sql = `
    INSERT INTO forms(
        user_id,asunto,descripcion,created_at
        )
        VALUES($1,$2,$3,$4)
      
    `;
    return db.none(sql,[
        userId,
        formulario.asunto,
        formulario.descripcion,
        new Date(),
    ]);
}


User.sendEmail = async (email,token)  => {
    /*var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "10ed7990295fdc",
          pass: "d8f4fa6db18464"
        }
      });*/

      var transport = nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure:false,
        auth: {
          user: "luisrcparra@gmail.com",
          pass: "vcwndtzlftmwcdxp"
        }
      });

      const info = await transport.sendMail({
        from : "Arrap - Unideal",
        to:email,
        subject:'Recupera tu cuenta de Unideal',
        text:'Recupera tu cuenta de Unideal',
        html: `
                <p>Hola:${email} , Verifica tu cuenta de Unideal</p> 
                <p>Solo debes dar click al siguiente enlace: 
                <a href="https://unideal.onrender.com/api/users/deleteToken/${token}">Comprobar Cuenta</a></p>
                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
                
`
      })
}


User.findById = (id,callback) => {
    const sql = `SELECT
                    id,
                    email,
                    name,
                    lastname,
                    image,
                    phone,
                    password,
                    session_token
                FROM
                    users
                WHERE
                    id=$1`;
    return db.oneOrNone(sql,id).then(user => {callback(null,user);});
}





User.findByEmail = (email) => {
    const sql = `SELECT
                    U.id,
                    U.email,
                    U.name,
                    U.lastname,
                    U.image,
                    U.phone,
                    U.password,
                    U.session_token,
                    json_agg(
                        json_build_object(
                            'id',R.id,
                            'name',R.name,
                            'image',R.image,
                            'route',R.route
                        )
                    ) AS roles
                FROM
                    users as U
                INNER JOIN
                    user_has_roles AS UHR
                ON
                    UHR.id_user = U.id
                INNER JOIN 
                    roles AS R
                ON 
                    R.id = UHR.id_rol
                WHERE
                    U.email=$1
                GROUP BY 
                    U.id`;
    return db.oneOrNone(sql,email);
}


User.findEmailToRecovery = (email) => {
    const sql = `
            SELECT EXISTS (SELECT 1 FROM users WHERE email = $1);

            `;
    return db.oneOrNone(sql,email);
}





User.findByUserId = (id) => {
    const sql = `SELECT
                    U.id,
                    U.email,
                    U.name,
                    U.lastname,
                    U.image,
                    U.phone,
                    U.password,
                    U.session_token,
                    json_agg(
                        json_build_object(
                            'id',R.id,
                            'name',R.name,
                            'image',R.image,
                            'route',R.route
                        )
                    ) AS roles
                FROM
                    users as U
                INNER JOIN
                    user_has_roles AS UHR
                ON
                    UHR.id_user = U.id
                INNER JOIN 
                    roles AS R
                ON 
                    R.id = UHR.id_rol
                WHERE
                    U.id=$1
                GROUP BY 
                    U.id`;
    return db.oneOrNone(sql,id);
}

User.create = (user) =>{

    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');

    user.password = myPasswordHashed;

    const sql = `INSERT INTO users(
        email,name,lastname,phone,image,password,created_at,updated_at
        )
        VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `;

    return db.oneOrNone(sql,[
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            user.password,
            new Date(),
            new Date()
    ])
        
}

User.RecoveryPassword = (email,password) =>{

    const PasswordHashed = crypto.createHash('md5').update(password).digest('hex');
   
    const sql = `UPDATE users SET password = $2,
                  recovery_token = $3
                WHERE email = $1`;

    return db.none(sql,[
        email,
        PasswordHashed,
        null
 
    ])
        
}



User.update = (user) =>{
    const sql = `
        UPDATE
            users
        SET
            name = $2,
            lastname = $3,
            phone = $4,
            image = COALESCE($5, image),
            updated_at = $6,
            email = $7
        WHERE 
            id = $1 
    `;
    console.log(user.id,user.name,user.lastname,user.phone,user.image,user.update_at,user.email)
    return db.none(sql,[
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date(),
        user.email
    ]);
   
}


User.updateToken = (id,token) =>{
    const sql = `
        UPDATE
            users
        SET
            session_token = $2
           
        WHERE 
            id = $1 
    `;
  
    return db.none(sql,[
       id,
       token
    ]);
   
}

User.updateTokenByEmail = (email,token) =>{
    const sql = `
        UPDATE
            users
        SET
            session_token = $2
           
        WHERE 
             email = $1 
    `;
  
    return db.none(sql,[
      email,
       token
    ]);
   
}

User.verifyRecoveryToken = (email) =>{
    const sql = `
        SELECT recovery_token from users where email = $1
    `;
  
    return db.oneOrNone(sql,[
       email
    ]);
   
}

User.deleteRecoveryToken = (token) =>{
    const sql = `
        UPDATE users SET recovery_token = NULL WHERE recovery_token = $1
    `;
  
    return db.none(sql,[
        token
    ]);
   
}




User.updateRecoveryToken = (email,token) =>{
    const sql = `
        UPDATE
            users
        SET
            recovery_token = $2
           
        WHERE 
            email = $1 
    `;
  
    return db.none(sql,[
       email,
       token
    ]);
   
}


User.isPasswordMatched = (userPassword,hash) =>{
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex') ;
    if(myPasswordHashed === hash){
        return true;
    } 

    return false;

}

User.findDeliveryMen = () => {
    const sql = `SELECT
                    U.id,
                    U.email,
                    U.name,
                    U.lastname,
                    U.image,
                    U.phone,
                    U.password,
                    U.session_token
                FROM 
                    users AS U
                INNER JOIN 
                    user_has_roles AS UHR
                ON 
                    UHR.id_user = U.id
                INNER JOIN
                    roles AS R
                ON 
                    R.id = UHR.id_rol
                WHERE
                    R.id = 3
                   ;`
    return db.manyOrNone(sql);
}

module.exports = User;

