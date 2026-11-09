CREATE DATABASE IF NOT EXISTS cine_db;

USE cine_db;

CREATE TABLE peliculas (
  id VARCHAR(36) PRIMARY KEY,
  titulo VARCHAR(100),
  genero VARCHAR(50),
  duracion INT
);

CREATE TABLE salas (
  id VARCHAR(36) PRIMARY KEY,
  nombre VARCHAR(50),
  capacidad INT
);

CREATE TABLE funciones (
  id VARCHAR(36) PRIMARY KEY,
  peliculaId VARCHAR(36),
  salaId VARCHAR(36),
  horario DATETIME,
  FOREIGN KEY (peliculaId) REFERENCES peliculas(id),
  FOREIGN KEY (salaId) REFERENCES salas(id)
);

CREATE TABLE tickets (
  id VARCHAR(36) PRIMARY KEY,
  funcionId VARCHAR(36),
  asiento VARCHAR(10),
  precio DECIMAL(8,2),
  FOREIGN KEY (funcionId) REFERENCES funciones(id)
);

CREATE TABLE reservaciones (
  id VARCHAR(36) PRIMARY KEY,
  cliente VARCHAR(100),
  ticketId VARCHAR(36),
  fecha DATE,
  FOREIGN KEY (ticketId) REFERENCES tickets(id)
);
