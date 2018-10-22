USE omsDB;

CREATE TABLE portfolios(
	id INTEGER AUTO_INCREMENT NOT NULL,
    portfolio VARCHAR(50),
    mandate VARCHAR(30),
    NAV DECIMAL(14, 2),
    cash DECIMAL(10,2),
    PRIMARY KEY(id)
)


INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 1", "segregated", 13000000, 3960000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 2", "income", 12800000, 3840000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 3", "income", 287000000, 8610000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 4", "income", 29000000, 870000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 5", "income", 29000000, 870000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 6", "income", 95000000, 2850000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 7", "income", 26000000, 780000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 8", "income", 15000000, 450000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 9", "income", 15000000, 450000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 10", "income", 131400000, 3942000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 11", "income", 42000000, 1260000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 12", "income", 10200000, 306000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 13", "equity", 31000000, 930000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 14", "equity", 166000000, 4980000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 15", "equity", 20000000, 600000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 16", "equity", 38000000, 1140000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 17", "long short", 36000000, 1080000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 18", "macro", 162000000, 4860000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 19", "balanced", 122000000, 3660000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 20", "balanced", 120000000, 3600000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 21", "balanced", 16600000, 498000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 22", "north american equity", 18000000, 540000);
INSERT INTO portfolios (portfolio, mandate, NAV, cash) VALUES ("Portfolio 23", "north american equity", 6700000, 201000);