const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool(
    {
        user: 'postgres',
        password: 'tigre17',
        host: 'localhost',
        database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db database.`)
);

pool.connect();

function promptUser() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: "options",
                message: "Choose one of the following options",
                choices: ['view all employees', 'add an employee', 'update an employee role', 'view all roles', 'add a role', 'view all departments', 'add a department', 'quit']
            }
        ])
        .then(responses => {
            const choice = responses.options;
            switch (choice) {
                case 'view all employees':
                    viewAllEmployees();
                    break;
                case 'add an employee':
                    addEmployee();
                    break;
                case 'update an employee role':
                    updateEmpRole();
                    break;
                case 'view all roles':
                    viewAllRoles();
                    break;
                case 'add a role':
                    addRole();
                    break;
                case 'view all departments':
                    viewAllDepartments();
                    break;
                case 'add a department':
                    addDepartment();
                    break;
                case 'quit':
                    quit();
                    break;
            }
        })
        .catch(error => console.error(error));
}

function viewAllEmployees() {
    pool.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
                CONCAT(m.first_name, ' ', m.last_name) AS manager 
                FROM employee e 
                LEFT JOIN role r ON e.role_id = r.id 
                LEFT JOIN department d ON r.department_id = d.id 
                LEFT JOIN employee m ON e.manager_id = m.id;`, 
        function (err, { rows }) {
            if (err) console.error(err);
            console.table(rows);
            promptUser();
    });
}

function viewAllDepartments() {
    pool.query('SELECT * FROM department;', function (err, { rows }) {
        if (err) console.error(err);
        console.table(rows);
        promptUser();
    });
}

function viewAllRoles() {
    pool.query(`SELECT r.id, r.title, d.name AS department, r.salary 
                FROM role r 
                LEFT JOIN department d ON r.department_id = d.id;`, 
        function (err, { rows }) {
            if (err) console.error(err);
            console.table(rows);
            promptUser();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'addDepartment',
                message: 'Enter department name'
            }
        ])
        .then(departmentResponse => {
            let deptName = departmentResponse.addDepartment;
            pool.query('INSERT INTO department (name) VALUES ($1)', [deptName], function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    viewAllDepartments();
                }
            });
        })
        .catch(error => console.error(error));
}

function addRole() {
    pool.query('SELECT * FROM department', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            const departmentList = data.rows.map((department) => ({
                value: department.id, 
                name: department.name
            })); 

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'addRole',
                        message: 'Enter role'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter salary'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Assign department',
                        choices: departmentList
                    }
                ])
                .then(roleResponse => {
                    let roleName = roleResponse.addRole;
                    let salary = roleResponse.salary;
                    let departmentChoice = roleResponse.department;
                    pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [roleName, salary, departmentChoice], function(err, data) {
                        if (err) {
                            console.error(err);
                        } else {
                            viewAllRoles();
                        }
                    });
                })
                .catch(error => console.error(error));
        }
    });
}

function addEmployee() {
    pool.query('SELECT * FROM role', function (err, roleData) {
        if (err) {
            console.error(err);
        } else {
            const roleList = roleData.rows.map((role) => ({
                value: role.id,
                name: role.title
            }));

            pool.query('SELECT * FROM employee', function (err, empData) {
                if (err) {
                    console.error(err);
                } else {
                    const employeeList = empData.rows.map((employee) => ({
                        value: employee.id,
                        name: `${employee.first_name} ${employee.last_name}`
                    }));
                    // Add an option for 'None' to the employeeList for no manager
                    employeeList.unshift({ value: null, name: 'None' });

                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'first_name',
                                message: 'Enter first name'
                            },
                            {
                                type: 'input',
                                name: 'last_name',
                                message: 'Enter last name'
                            },
                            {
                                type: 'list',
                                name: 'role_id',
                                message: 'Assign role',
                                choices: roleList
                            },
                            {
                                type: 'list',
                                name: 'manager_id',
                                message: 'Assign manager',
                                choices: employeeList
                            }
                        ])
                        .then(empResponse => {
                            let firstName = empResponse.first_name;
                            let lastName = empResponse.last_name;
                            let roleId = empResponse.role_id;
                            let managerId = empResponse.manager_id;
                            pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId], function(err, data) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    viewAllEmployees();
                                }
                            });
                        })
                        .catch(error => console.error(error));
                }
            });
        }
    });
}

function updateEmpRole() {
    pool.query('SELECT * FROM employee', function (err, empData) {
        if (err) {
            console.error(err);
        } else {
            const employeeList = empData.rows.map((employee) => ({
                value: employee.id,
                name: `${employee.first_name} ${employee.last_name}`
            }));

            pool.query('SELECT * FROM role', function (err, roleData) {
                if (err) {
                    console.error(err);
                } else {
                    const roleList = roleData.rows.map((role) => ({
                        value: role.id,
                        name: role.title
                    }));

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employee_id',
                                message: 'Select employee to update',
                                choices: employeeList
                            },
                            {
                                type: 'list',
                                name: 'role_id',
                                message: 'Assign new role',
                                choices: roleList
                            }
                        ])
                        .then(updateResponse => {
                            let employeeId = updateResponse.employee_id;
                            let roleId = updateResponse.role_id;
                            pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId], function(err, data) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    viewAllEmployees();
                                }
                            });
                        })
                        .catch(error => console.error(error));
                }
            });
        }
    });
}

function quit() {
    console.log('Goodbye!');
    process.exit();
}

promptUser();

