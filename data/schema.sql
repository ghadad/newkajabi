CREATE TABLE accounts (
   id INT(11) NOT NULL AUTO_INCREMENT,
   email VARCHAR(50) NOT NULL,
   password VARCHAR(255) NOT NULL,
   secret  TEXT NOT NULL ,
   qrcode  TEXT NOT NULL ,
   verified_once  TEXT NOT NULL ,    
   activation_code  VARCHAR(255) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
);

CREATE TABLE verifications (
   id INT(11) NOT NULL AUTO_INCREMENT,
   email VARCHAR(50) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   Client_id TEXT NOT NULL ,    
   verification_status  BOOLEAN not null ,
   PRIMARY KEY (id)
);

CREATE TABLE scans (
   id INT(11) NOT NULL AUTO_INCREMENT,
   email VARCHAR(50) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   Client_id TEXT NOT NULL ,    
   scan_status  BOOLEAN not null ,
   PRIMARY KEY (id)
);

