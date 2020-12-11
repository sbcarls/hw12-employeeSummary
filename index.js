const mysql = require("mysql");
const inq = require("inquirer");
const cTable = require("console.table");
const { start } = require("repl");
const { allowedNodeEnvironmentFlags } = require("process");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:
    database: "employeeTracker_db",
});

connection.connect((err) => {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "userOption",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add a Department", "Add a Role", "Add an Employee", "View All Employees", "View All Roles", "View ALl Departments", "Update an Employee's Role", "None"]
        }) .then(answer => {
            if(answer.userOption === "Add a Department") {
                addDepartment();
            }
            else if (answer.userOption === "Add a Role") {
                addRole();
            }
            else if (answer.userOption === "Add an Employee") {
                addEmployee();
            }
            else if (answer.userOption === "View All Employees") {
                viewEmployees();
            }
            else if (answer.userOption === "View All Roles") {
                viewRoles();
            }
            else if (answer.userOption === "View All Departments") {
                viewDepartments();
            }
            else if (answer.userOption === "Update Employee's Role") {
                updateEmployeeRole();
            }
            else if (answer.userOption === "None") {
                connection.end();
            }
        });
    }
// Adding New Department(s)
        function addDepartment() {
            inquirer.prompt({
                name: "departmentName",
                type: "input",
                message: "What department would you like to add?"
            }) .then (function (res) {
                var query = connection.query(
                    "INSERT INTO department SET ?",
                    {
                        name: res.departmentName,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The Department Was Added");
                        start();
                    }
                )
            });
        }
// Adding New Role(s)
        function addRole() {
            let deptArr = [];
            connection.query("SELECT * FROM department", (err,res) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "input",
                        name: "addRole",
                        message: "What role would you like to add?",
                    },
                    {
                        type: "input",
                        name: "addSalary",
                        message: "What is this role's salary amount?",
                        validate: function (salary) {
                            if (isNaN(salary) === false) {
                                return true;
                            }
                            return false;
                        }
                    },

                    {
                        type: "rawlist",
                        name: "whichDept",
                        choices: () => {
                            for (var i = 0; i < res.length; i++) {
                                deptArr.push(res[i].name);
                            }
                            return deptArr;
                        },
                        message: "Which department is this role being added to?",
                    },
                ]).then((newRole) => {
                    let deptIndex = deptArr.indexOf(newRole.whichDept);
                    let deptId = res[deptIndex].id;
                    connection.query(
                        "INSERT INTO role SET?",
                        {
                            title: newRole.addRole,
                            salary: newRole.addSalary,
                            department_id: deptId,
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("The new role has been added");
                            start();
                        }
                    );
                });
            });
        }

        function viewEmployees(table) {
            connection.query(`SELECT * FROM ${table}`, function (err,res) {
                if (err) throw err;
                console.table(res);
            });
        }

        function addEmployee() {
            inquirer.prompt([
                {
                    type: "input",
                    name: "employeeFirstName",
                    message: "What is the first name of the employee?"
                },
                {
                    type: "input",
                    name: "employeeLastName",
                    message: "What is the last name of the employee?",
                },
                {
                    type: "input",
                    name: "employeeRoleId",
                    message: "What is the Role ID for the Employee?",
                    validate: function (salary) {
                        if (isNaN(salary) === false) {
                            return true;
                        }
                        return ("Numeric values only");
                    }
                },
                {
                    type: "input",
                    name: "employeeManagerId",
                    message: "What is the Manager ID for the Employee?",
                    validate: function (salary) {
                        if (isNaN(salary) === false) {
                            return true;
                        }
                        return ("Numeric values only");
                    }
                }
            ]).then(function (newEmployee) {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: newEmployee.employeeFirstName,
                        last_name: newEmployee.employeeLastName,
                        role_id: newEmployee.employeeRoleId,
                        manager_id: newEmployee.employeeManagerId,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("New Employee Added");
                        start();
                    }
                );
            });
        }

        function updateEmployeeRole() {
            letempArr = [];
            connection.query("SELECT * FROM employee", (err,res) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "rawlist",
                        name: "update",
                        choices: function () {
                            var empArr = [];
                            for (var i = 0; i < res.length; i++) {
                                empArr.push({
                                    name: `${res[i].frist_name} ${res[i].last_name}`,
                                    value: res[i].id
                                });
                            }
                            return empArr;
                        },
                        message: "Which Employee do you want to Update?"
                    },
                ]).then(function (res) {
                    var roleArr = [];
                    console.log(res)
                    let empId = res.update;

                    connection.query("SELECT * FROM role", (err, res) => {
                        if (err) throw err;

                        inquirer.prompt([
                            {
                                name: "changeRole",
                                type: "rawlist",
                                choices: () => {
                                    for (var i = 0; i < res.length; i++) {
                                        roleArr.push ({
                                            name: res[i].title,
                                            value: res[i].id,
                                        });
                                    }
                                    return roleArr;
                                },
                                message: "What is the new role for the employee?"
                            },
                        ]).then((res) => {
                            let
                        })
                    })
                })
            })
        }