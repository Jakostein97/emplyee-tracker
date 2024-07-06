DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

\c employee_tracker_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INTEGER,
  FOREIGN KEY (role_id)
  REFERENCES role(id),
  manager_id INTEGER,
  FOREIGN KEY (manager_id)
  REFERENCES employee(id)
);