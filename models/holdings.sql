USE omsDB;

CREATE TABLE holdings(
	id INTEGER AUTO_INCREMENT NOT NULL,
    portfolio VARCHAR(50),
    ticker VARCHAR(15),
	shares INTEGER,
    closeprice DECIMAL(8,2),
    primary key(id)
);


