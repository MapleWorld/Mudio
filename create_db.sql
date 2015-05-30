-- Tested with MySQL v5.1.73

-- CREATE SCHEMA communityfund;

-- insert into user (username, password, created_date, email, mailing_address, phone, gender, money, organization, interest, admin) values 
--	('admin','111111', '2014-10-23 20:04:25', 'test1@email.com', 'toronto', '416-888-8888', 'male', 999999, 'Uoft', 'health', 1); 
	
create table user (
	-- General Data
	id int AUTO_INCREMENT PRIMARY KEY,
	username varchar(50) UNIQUE NOT NULL,
	password varchar(20) NOT NULL,
	created_date datetime NOT NULL,
	comparable_date int default 0,
	email varchar(100) UNIQUE NOT NULL,

	firstname varchar(50),
	lastname varchar(50),
	phone varchar(20),
	gender varchar(10),
	user_reputation int default 0,

	-- Admin
	admin tinyint default 0 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table music(
	id int AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL,
	description varchar(255),
	audio varchar(255),						-- Rename audio file name to id (prevent duplicate file name)
	owner int NOT NULL,
	instrument varchar(255),
	sheets varchar(255) NOT NULL, 	-- Any format but need to add id to their name before saving
	vistor int default 0,
	rating int default 0,
	created_date datetime NOT NULL,
	comparable_date int default 0,
	FOREIGN KEY (owner) references user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	

	

	
	