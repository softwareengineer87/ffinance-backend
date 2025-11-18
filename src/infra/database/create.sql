
CREATE TABLE IF NOT EXISTS business
(
    business_id character varying(100),
    name character varying(50),
    email character varying(100),
    password character varying(150),
    cnpj character varying(255),
    PRIMARY KEY (business_id)
);

CREATE TABLE IF NOT EXISTS categories
(
    category_id character varying(100),
    title character varying(150),
    PRIMARY KEY (category_id)
);

CREATE TABLE IF NOT EXISTS transactions
(
    transaction_id character varying(100),
    value numeric,
    description character varying(255),
    type character varying(30),
    category character varying(50),
    date timestamp without time zone,
    business_id character varying(100),
    PRIMARY KEY (transaction_id),

    CONSTRAINT fk_business FOREIGN KEY(business_id) REFERENCES business(business_id)
);

CREATE TABLE IF NOT EXISTS payments
(
    payment_id character varying(100),
    value numeric,
    payment_mode character varying(50),
    status character varying(50),
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    created_at timestamp without time zone,
    business_id character varying(100),
    PRIMARY KEY (payment_id),

    CONSTRAINT fk_business FOREIGN KEY(business_id) REFERENCES business(business_id)  
);

CREATE TABLE IF NOT EXISTS photos (
  photo_id TEXT PRIMARY KEY,
  business_id TEXT,
  url TEXT,

  CONSTRAINT fk_business FOREIGN KEY(business_id) REFERENCES business(business_id)
);


