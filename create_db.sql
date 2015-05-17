-- Tested with MySQL v5.1.73

-- CREATE SCHEMA communityfund;

-- insert into user (username, password, created_date, email, mailing_address, phone, gender, money, organization, interest, admin) values 
--	('admin','111111', '2014-10-23 20:04:25', 'test1@email.com', 'toronto', '416-888-8888', 'male', 999999, 'Uoft', 'health', 1); 
	
create table user (
	-- General Data
	id int AUTO_INCREMENT PRIMARY KEY,
	username varchar(40) UNIQUE NOT NULL,
	password varchar(100) NOT NULL,
	created_date datetime NOT NULL,
	comparable_date int default 0,
	email varchar(40) UNIQUE NOT NULL,
	
	firstname varchar(20),
	lastname varchar(20),
	phone varchar(20),
	gender varchar(10),
	mailing_address varchar(100),
	user_reputation int default 0,
	
	-- Admin
	admin tinyint default 0 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



	
	