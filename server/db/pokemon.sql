DROP TABLE stats;
DROP TABLE pokemon;

CREATE TABLE pokemon(
  id SERIAL,
  natNo VARCHAR(4) PRIMARY KEY,
  name VARCHAR(255),
  types VARCHAR(255),
  height DECIMAL,
  weight DECIMAL
);

CREATE TABLE stats(
  id SERIAL PRIMARY KEY,
  health INT,
  attack INT,
  defense INT,
  sp_attk INT,
  sp_def INT,
  speed INT,
  owner VARCHAR(4) REFERENCES pokemon(natNo)
);

INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#001', 'Bulbasaur', 'Grass-Poison', 0.7, 6.9);
INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#002', 'Ivysaur', 'Grass-Poison', 1, 13);
INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#003', 'Venusaur', 'Grass-Poison', 2, 100);
INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#004', 'Charmander', 'Fire', 0.6, 8.5);
INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#005', 'Charmeleon', 'Fire', 1.1, 19);
INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#006', 'Charizard', 'Flying-Fire', 1.7, 90.5);
INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#007', 'Squirtle', 'Water', 0.5, 9);
INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#008', 'Wartortle', 'Water', 1, 22.5);
INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#009', 'Blastoise', 'Water', 1.6, 85.5);
INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ('#025', 'Pikachu', 'Electric', 0.4, 6);

INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (45, 49, 49, 65, 65, 45, '#001');
INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (60, 80, 80, 63, 62, 60, '#002');
INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (80, 100, 100, 83, 82, 80, '#003');
INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (39, 52, 43, 60, 50, 65, '#004');
INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (80, 65, 80, 58, 64, 58, '#005');
INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (100, 85, 109, 78, 84, 78, '#006');
INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (44, 48, 65, 50, 64, 43, '#007');
INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (58, 80, 65, 80, 63, 59, '#008');
INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (78, 105, 85, 100, 83, 79, '#009');
INSERT INTO stats (health, attack, defense, sp_attk, sp_def, speed, owner) VALUES (35, 55, 40, 50, 50, 90, '#025');
