DROP TABLE stats;
DROP TABLE pokemon;
DROP TABLE libStats;
DROP TABLE libPokemon;

CREATE TABLE pokemon(
  id SERIAL PRIMARY KEY,
  natno VARCHAR(4),
  name VARCHAR(255),
  types VARCHAR(255),
  height DECIMAL,
  weight DECIMAL,
  abilities VARCHAR(255)
);

CREATE TABLE stats(
  id SERIAL REFERENCES pokemon(id),
  health INT,
  attack INT,
  defense INT,
  sp_attk INT,
  sp_def INT,
  speed INT,
  level INT,
  owner VARCHAR(4)
);

CREATE TABLE libPokemon(
  id SERIAL PRIMARY KEY,
  natno VARCHAR(4),
  name VARCHAR(255),
  types VARCHAR(255),
  height DECIMAL,
  weight DECIMAL,
  abilities VARCHAR(255)
);

CREATE TABLE libStats(
  id SERIAL REFERENCES libPokemon(id),
  health INT,
  attack INT,
  defense INT,
  sp_attk INT,
  sp_def INT,
  speed INT,
  level INT,
  owner VARCHAR(4)
);
