# Employee Tracker Application

## Description

Employee Tracker CLI is a command-line application for managing a company's employee database. The application allows users to view and manage departments, roles, and employees within the company.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

[GitHub Repository](https://github.com/Jakostein97/emplyee-tracker)

1. Clone the repository:

    git clone <repository_url>
    cd employee-tracker-cli

2. Install dependencies:

    npm install

3. Set up PostgreSQL database

Ensure you have PostgreSQL installed and running. Create a database named employee_tracker_db and set up the required tables. You can use the following SQL schema as a starting point:

    CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL);

    CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary NUMERIC NOT NULL,
    department_id INTEGER REFERENCES department(id));

    CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER REFERENCES role(id),
    manager_id INTEGER REFERENCES employee(id));

4. Configure database connection

Update the database configuration in index.js to match your PostgreSQL setup:

    const pool = new Pool({
    user: 'your_postgres_user',
    password: 'your_postgres_password',
    host: 'localhost',
    database: 'employee_tracker_db'});


## Usage

1. Run the application:

    node index.js

2. Follow the prompts:

    Use the arrow keys to navigate through the options and select the desired operation. Follow the prompts to view, add, or update data in the employee database.

![Walkthorugh](assets/images/Employee%20Tracker%20Walkthrough.gif)

## License

This project is licensed under the MIT License.