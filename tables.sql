 create table users(user_id int NOT NULL AUTO_INCREMENT,name varchar(30) NOT NULL,email varchar(30) NOT NULL, salt varchar(255) NOT NULL,password_hash varchar(255) NOT NULL,profileImageLink varchar(255),createdAt DATETIME NOT NULL DEFAULT NOW(), PRIMARY KEY(user_id))
​
 create table blog_category(cat_id int NOT NULL AUTO_INCREMENT, category varchar(255) NOT NULL, PRIMARY KEY(cat_id));
​
 create table blogs(blog_id int NOT NULL AUTO_INCREMENT, user_id int NOT NULL,cat_id int NOT NULL,blog_title varchar(255), blog_content varchar(255),postImageLink varchar(255),postedAt DATETIME NOT NULL DEFAULT NOW(), PRIMARY KEY(blog_id), FOREIGN KEY(user_id) REFERENCES users(user_id),FOREIGN KEY(cat_id) REFERENCES blog_category(cat_id));
​
 create table comments(comm_id int NOT NULL AUTO_INCREMENT, blog_id int NOT NULL, user_id int NOT NULL,comment varchar(255),commentedAt DATETIME NOT NULL DEFAULT NOW(),commentImageLink varchar(255), PRIMARY KEY (comm_id), FOREIGN KEY (blog_id) REFERENCES blogs(blog_id),FOREIGN KEY (user_id) REFERENCES users(user_id));