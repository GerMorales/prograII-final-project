/*
************* login functionality begin
*/
function checkLogin() {

    var user = document.getElementById("user").value;
    var password = document.getElementById("passw").value;


    var userArray = JSON.parse(localStorage.getItem("lUserArray"));

    if (user !== null && user !== "") {
        if (password !== null && password !== "") {

            var canLogin = checkLoginInfo(user, password, userArray);
            if (canLogin === true) {
                //need a method to get the role and send it into createSessionUser below
                var role = getUserRole(user, password, userArray)
                createSessionUser(user, password, role)
                window.location.href = "http://localhost:5000/dashboard";
                //window.location.href = "http://heroku:5000/dashboard";
            } else {
                alert("La contraseña o el usuario no es correcto");
            }

        } else {
            alert("La contraseña no puede ser vacia");
        }
    } else {
        alert("El usuario no puede ser vacio");
    }

}

function checkLoginInfo(user, password, userArray) {
    if (userArray !== null && userArray.length > 0) {
        for (var i = 0; i < userArray.length; i++) {
            if (userArray[i].user === user && userArray[i].password === password) {
                return true;
            }
        }
    }
    return false;
}

function getUserRole(pUser, pPassword, pUserArray) {
    var role = ""
    if (pUserArray !== null && pUserArray.length > 0) {
        var length = pUserArray.length
        for (var i = 0; i < length; i++) {
            if (pUserArray[i].user === pUser && pUserArray[i].password === pPassword) {
                role = pUserArray[i].role
                break
            }
        }
    }
    return role
}

function createSessionUser(user, password, role) {
    var logged_user = {
        user: user,
        password: password,
        role: role
    };

    sessionStorage.setItem("loggedUser", JSON.stringify(logged_user));
}

/*
************* login functionality end
*/


/*
************* register functionality begin
*/

function registerNewUser() {
    var reg_user = document.getElementById("user_reg").value;
    var reg_password = document.getElementById("passw_reg").value;
    var reg_role = document.getElementById("role_reg").value

    //alert(reg_user);
    var userArray = [];

    if (localStorage.getItem("lUserArray") !== null) {
        userArray = JSON.parse(localStorage.getItem("lUserArray"));
    }

    var current_reg = {
        user: reg_user,
        password: reg_password,
        role: reg_role
    };

    userArray.push(current_reg);

    localStorage.setItem("lUserArray", JSON.stringify(userArray));

    window.location.href = "http://localhost:5000/login"
    //window.location.href = "http://heroku:5000/login";
}

/*
************* register functionality end
*/


/*
************* dashboard functionality begin
*/



if (window.location.href.includes("dashboard")) {
    //un if general para el dashboard y asi podemos poner todos los metodos que necesitemos
    checkForValidLoginSession()
    setUserNameOnDashboard()
    w3.includeHTML()
}

function checkForValidLoginSession() {
    /*
    tengo que ir a buscar el elemento wUserArray, si no esta vacio
    entonces dejo pasar al dashboard si no es el caso entonces debo redirigir
    hacia el login
    */

    if (sessionStorage.getItem("loggedUser") == null) {
        window.location.href = "http://localhost:5000/login"
        //window.location.href = "http://heroku:5000/login";
    }
}

function setUserNameOnDashboard() {
    var userArray = getCurrentLoggedUser()
    var currentUser = userArray.user
    var currentRole = userArray.role

    var userSpan = document.getElementById("user")
    userSpan.innerText = "Hola, " + currentRole + " " + currentUser + ", bienvenido/a a tu perfil de citas médicas en línea"

    modifyDashboardForRole(currentRole)
}

function getCurrentLoggedUser() {
    var currentLoggedUser = JSON.parse(sessionStorage.getItem("loggedUser"))
    return currentLoggedUser
}

function modifyDashboardForRole(pCurrentRole) {
    var add_admin = document.getElementById("admin")
    var add_client = document.getElementById("client")
    if (pCurrentRole === "admin") {
        //modifcar el dashboard para admin
        add_admin.style.display = "block"
        add_client.style.display = "none"
    } else {
        //modifcar el dashboard para client
        add_admin.style.display = "none"
        add_client.style.display = "block"
    }
}




function logout() {
    sessionStorage.removeItem("loggedUser")
    window.location.href = "http://localhost:5000/"
    //window.location.href = "http://heroku:5000/";
}




/*
************* dashboard functionality end
*/

/*
************* dashboard functionality add admin
*/
if (window.location.href.includes("dashboard")) {
    var currentLoggedUser = getCurrentLoggedUser()
    if (currentLoggedUser.role === "admin") {

        const elementToObserve = document.getElementById("admin")

        const observer = new MutationObserver(function () {
            var currentLoggedUser = getCurrentLoggedUser()
            loadAddDataFromAllUsers()
            observer.disconnect()
        });

        observer.observe(elementToObserve, { subtree: true, childList: true });
    }
}

function loadAddDataFromAllUsers() {
    var addResultArray
    if (localStorage.getItem("lAddResultArray") !== null) {
        addResultArray = JSON.parse(localStorage.getItem("lAddResultArray"));
    }

    var userTableAdmin = document.getElementById("userTableAdmin")
    var row

    for (var addResult of addResultArray) {
        row = userTableAdmin.insertRow(1)

        row.insertCell(0).innerHTML = addResult.user;
        row.insertCell(1).innerHTML = addResult.num1;
        row.insertCell(2).innerHTML = addResult.num2;
        row.insertCell(3).innerHTML = addResult.result;
        row.insertCell(4).innerHTML = "<a>modify</a>";
        row.insertCell(5).innerHTML = "<a>delete</a>";
    }
}

/*
************* dashboard functionality add admin
*/


/*
************* dashboard functionality add client
*/

function add() {
    var date1 = document.getElementById("date1").value
    var doctors = document.getElementById("doctores").value
    var especialidad = document.getElementById("especialidad").value
    var reason = document.getElementById("reason").value

    cleanForm()
    addResultToStorage(date1, doctors, especialidad, reason)

}
//
function cleanForm() {

    var date1 = document.getElementById("date").value = ""
    var doctors = document.getElementById("doctores").value = ""
    var especialidad = document.getElementById("especialidad").value = ""
    var reason = document.getElementById("reason").value = ""
}

function addResultToTable() {
    var table = document.getElementById("userTableClient");
    var retrievedApp = JSON.parse(localStorage.getItem("lAddResultArray"));

    
    for (var i = 0; i < retrievedApp.length; i++) {
        var row = table.insertRow(1)
        

        row.insertCell(0).innerHTML = retrievedApp[i].date1;
        row.insertCell(1).innerHTML = retrievedApp[i].doctors;
        row.insertCell(2).innerHTML = retrievedApp[i].especialidad;
        row.insertCell(3).innerHTML = retrievedApp[i].reason;
    }
}

function addResultToStorage(pDate, pDoctors, pEspecialidad, pReason) {
    var addResultArray = [];

    if (localStorage.getItem("lAddResultArray") !== null) {
        addResultArray = JSON.parse(localStorage.getItem("lAddResultArray"));
    }

    var current_add_result = {
        date1: pDate,
        doctors: pDoctors,
        especialidad: pEspecialidad,
        reason: pReason
    }

    addResultArray.push(current_add_result)
    localStorage.setItem("lAddResultArray", JSON.stringify(addResultArray));

    addResultToTable()
    
}
/*
************* bloquear doctores que no se usan
*/

function showDiv() {
    var especialidad = document.getElementById("especialidad").value

    if (especialidad == "General") {
        document.getElementById("doctors").innerHTML = `
        <select name="doctores" id="doctores">
        <option value="Dra. Meredith Grey">Dra. Meredith Grey</option>
        <option value="Dra. Miranda Bailey">Dra. Miranda Bailey</option>
        <option value="Dr. Richard Webber">Dr. Richard Webber</option>
        </select>
        `;

    } if (especialidad == "Neurología") {
        document.getElementById("doctors").innerHTML = `
        <select name="doctores" id="doctores">
        <option value="Dr. Derek Shepherd">Dr. Derek Shepherd</option>
        <option value="Dra. Lexie Grey">Dra. Lexie Grey</option>
        <option value="Dra. Amelia Shepherd">Dra. Amelia Shepherd</option>
        </select>
        `;

    } if (especialidad == "Cardiología") {
        document.getElementById("doctors").innerHTML = `
        <select name="doctores" id="doctores">
        <option value="Dra. Cristina Yang">Dra. Cristina Yang</option>
        <option value="Dr. Preston Burke">Dr. Preston Burke</option>
        <option value="Dra. Erica Hahn">Dra. Erica Hahn</option>
        </select>
        `;

    } if (especialidad == "Pediatría") {
        document.getElementById("doctors").innerHTML = `
        <select name="doctores" id="doctores">
        <option value="Dr. Alex Karev">Dr. Alex Karev</option>
        <option value="Dra. Arizona Robbins">Dra. Arizona Robbins</option>
        <option value="Dr. Charles Percy">Dr. Charles Percy</option>
        </select>
        `;

    } if (especialidad == "Trauma") {
        document.getElementById("doctors").innerHTML = `
        <select name="doctores" id="doctores">
        <option value="Dr. Gorge O'Malley">Dr. Gorge O'Malley</option>
        <option value="Dr. Owen Hunt">Dr. Owen Hunt</option>
        <option value="Dra. April Kepner">Dra. April Kepner</option>
        </select>
        `;

    } if (especialidad == "Plástica") {
        document.getElementById("doctors").innerHTML = `
        <select name="doctores" id="doctores">
        <option value="Dr. Mark Sloan">Dr. Mark Sloan</option>
        <option value="Dr. Jackson Avery">Dr. Jackson Avery</option>
        <option value="Dr. Andrew Deluca">Dr. Andrew Deluca</option>
        </select>
        `;

    } if (especialidad == "Ortopedia") {
        document.getElementById("doctors").innerHTML = `
        <select name="doctores" id="doctores">
        <option value="Dra. Calliope Torres">Dra. Calliope Torres</option>
        <option value="Dra. Isobel Stevens">Dra. Isobel Stevens</option>
        <option value="Dr. Ben Warren">Dr. Ben Warren</option>
        </select>
        `;

    } if (especialidad == "Obstetricia") {
        document.getElementById("doctors").innerHTML = `
        <select name="doctores" id="doctores">
        <option value="Dra. Addison Montgomery">Dra. Addison Montgomery</option>
        <option value="Dra. Stephanie Edwards">Dra. Stephanie Edwards</option>
        <option value="Dra. Joe Willson">Dra. Joe Willson</option>
        </select>
        `;

    }
}

/*
************* dashboard functionality add client
*/
