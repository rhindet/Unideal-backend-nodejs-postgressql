DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL ,
	is_avaliable BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	recovery_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
	

); 

DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	route VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS restaurants CASCADE;
CREATE TABLE restaurants(
		restaurant_id BIGINT NOT NULL,
		user_id BIGINT NOT NULL,
		name VARCHAR(90) NOT NULL,
		tarifa DECIMAL DEFAULT 0,
		banner VARCHAR(255)  NULL,
		phone VARCHAR(20)  NULL,
		logo  VARCHAR(255)  NULL,
		rate DECIMAL DEFAULT 0,
		is_avaliable BOOLEAN DEFAULT false,
		time_min  BIGINT NULL DEFAULT 0,
		time_max  BIGINT NULL DEFAULT 0,
		created_at TIMESTAMP(0) NOT NULL,
		updated_at TIMESTAMP(0) NOT NULL,
		PRIMARY KEY(restaurant_id),
		FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
		
);



INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'CLIENTE',
	'client/products/list',
	'2021-05-22',
	'2021-05-22'
);


INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'RESTAURANTE',
	'restaurant/orders/list',
	'2021-05-22',
	'2021-05-22'
);

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'REPARTIDOR',
	'delivery/orders/list',
	'2021-05-22',
	'2021-05-22'
);


DROP TABLE IF EXISTS user_has_roles CASCADE;
CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_user,id_rol)
);




DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	description VARCHAR(255) NOT NULL UNIQUE,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);




DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	description VARCHAR(255) NOT NULL ,
	price DECIMAL DEFAULT 0,
	discount DECIMAL DEFAULT 0,
	image1 VARCHAR(255)  NULL,
	image2 VARCHAR(255) NULL,
	image3 VARCHAR(255) NULL,
	id_category BIGINT NOT NULL,
	id_user  BIGINT NOT NULL,
	inventory DECIMAL DEFAULT 0,
	is_avaliable BOOLEAN DEFAULT false,
	id_restaurant  BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_restaurant) REFERENCES restaurants(restaurant_id) ON UPDATE CASCADE ON DELETE CASCADE
);


DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address(
	id BIGSERIAL PRIMARY KEY,
	id_user BIGINT NOT NULL,
	address VARCHAR(255) NOT NULL,
	neighborhood VARCHAR(255) NOT NULL,
	lat DECIMAL DEFAULT 0,
	lng DECIMAL DEFAULT 0,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);


DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders(
    id BIGSERIAL PRIMARY KEY,
    id_client BIGINT NOT NULL,
    id_delivery BIGINT  NULL,
    id_restaurant BIGINT  NULL,
    id_address BIGINT NOT NULL,
    lat DECIMAL DEFAULT 0,
    lng DECIMAL DEFAULT 0,
    total DECIMAL DEFAULT 0,
	status VARCHAR(90) NOT NULL,
    is_avaliable BOOLEAN DEFAULT false,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,    
    FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,    
    FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE,        
    FOREIGN KEY(id_restaurant) REFERENCES restaurants(restaurant_id) ON UPDATE CASCADE ON DELETE CASCADE
);


DROP TABLE IF EXISTS order_has_products CASCADE;
CREATE TABLE order_has_products(
		id_order BIGINT NOT NULL,
		id_product BIGINT NOT NULL,
		quantity BIGINT NOT NULL,
		created_at TIMESTAMP(0) NOT NULL,
		updated_at TIMESTAMP(0) NOT NULL,
		PRIMARY KEY(id_order,id_product),
		FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,	
		FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);





DROP TABLE IF EXISTS forms CASCADE;
CREATE TABLE forms(
	user_id BIGINT NOT NULL,
	asunto VARCHAR(255) NOT NULL,
	descripcion VARCHAR(255) NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
)