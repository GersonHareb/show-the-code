# show-the-code
Blog format for DL's job fair

commands:
npm i express express-handlebars jsonwebtoken bootstrap pg express-fileupload nodemon

nodemon server.js


--color
#f6f1ea


create table usuario (id serial primary key, nombre varchar(50) not null, apellido varchar(50) not null, email varchar(100) not null, password varchar(25) not null, pfp varchar(255) null, blog_name varchar(50) not null);