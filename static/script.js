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
                window.location.href = "https://registro-medico.herokuapp.com/dashboard";
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

    window.location.href = "https://registro-medico.herokuapp.com/login"
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
        window.location.href = "https://registro-medico.herokuapp.com/login"
    }
}

function setUserNameOnDashboard() {
    var userArray = getCurrentLoggedUser()
    var currentUser = userArray.user
    var currentRole = userArray.role

    var userSpan = document.getElementById("user")
    userSpan.innerText = "Hola, " + currentUser + ", bienvenido/a a tu perfil de citas médicas en línea"

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
    window.location.href = "https://registro-medico.herokuapp.com/"
}




/*
************* dashboard functionality end
*/
/*
************* dashboard functionality add client
*/
if (window.location.href.includes("dashboard")) {
    var currentLoggedUser = getCurrentLoggedUser()
    var currentUser = currentLoggedUser.user
    if (currentLoggedUser.role === "client") {

        const elementToObserve = document.getElementById("client")

        const observer = new MutationObserver(function () {
            loadAddDataByUser(currentUser)
            observer.disconnect()
        });

        observer.observe(elementToObserve, { subtree: true, childList: true });
    }
}

function loadAddDataByUser(pCurrentUser) {
    var addResultArray

    if (localStorage.getItem("lAddResultArray") !== null) {
        addResultArray = JSON.parse(localStorage.getItem("lAddResultArray"));
    }

    var userTableClient = document.getElementById("userTableClient")
    var row

    for (var addResult of addResultArray) {
        if (addResult.user === pCurrentUser) {
            row = userTableClient.insertRow(1)

            row.insertCell(0).innerHTML = addResult.date1;
            row.insertCell(1).innerHTML = addResult.hour;
            row.insertCell(2).innerHTML = addResult.doctors;
            row.insertCell(3).innerHTML = addResult.especialidad;
            row.insertCell(4).innerHTML = addResult.reason;
        }
    }
}
function initialForm() {
    document.getElementById("message").innerHTML="Sus datos fueron guardados correctamente. Si necesita actualizar su información, por favor llene el formulario nuevamente."
    
        var date = document.getElementById("date").value
        var name = document.getElementById("name").value
        var address = document.getElementById("address").value
        var datebirth = document.getElementById("datebirth").value
        var sex = document.getElementById("sex").value
        var civil = document.getElementById("civil").value
        var tel = document.getElementById("tel").value
        var cel = document.getElementById("cel").value
        var mail = document.getElementById("mail").value
    
    
        addFormToStorage(date, name, address, datebirth, sex, civil, tel, cel, mail)
        cleanFormInitial()
}

function addFormToStorage(pDate, pName, pAddress, pDateBirth, pSex, pCivil, pTel, pCel, pMail) {
        var initialFormArray = [];
    
        //obtener el current logged user
        var currentLoggedUser = getCurrentLoggedUser()
        //console.log(currentLoggedUser.user)
    
        if (localStorage.getItem("lInitialFormArray") !== null) {
            initialFormArray = JSON.parse(localStorage.getItem("lInitialFormArray"));
        }
    
        var current_form= {
            user: currentLoggedUser.user,
            date: pDate,
            name: pName,
            address: pAddress,
            datebirth: pDateBirth,
            sex: pSex,
            civil: pCivil,
            tel: pTel,
            cel: pCel,
            mail: pMail
    
    
        }
    
        initialFormArray.push(current_form)
        localStorage.setItem("lInitialFormArray", JSON.stringify(initialFormArray));
    
}
function cleanFormInitial() {

    var date = document.getElementById("date").value = ""
    var name = document.getElementById("name").value = ""
    var address = document.getElementById("address").value = ""
    var datebirth = document.getElementById("datebirth").value = ""
    var sex = document.getElementById("sex").value = ""
    var civil = document.getElementById("civil").value = ""
    var tel = document.getElementById("tel").value = ""
    var cel = document.getElementById("cel").value = ""
    var mail = document.getElementById("mail").value = ""

}


function add() {
    var date1 = document.getElementById("date1").value
    var hour = document.getElementById("hour").value
    var doctors = document.getElementById("doctores").value
    var especialidad = document.getElementById("especialidad").value
    var reason = document.getElementById("reason").value

    cleanForm()
    addResultToTable(date1, hour, doctors, especialidad, reason)
    addResultToStorage(date1, hour, doctors, especialidad, reason)

}
//
function cleanForm() {

    var date1 = document.getElementById("date").value = ""
    var hour = document.getElementById("hour").value = ""
    var doctors = document.getElementById("doctores").value = ""
    var especialidad = document.getElementById("especialidad").value = ""
    var reason = document.getElementById("reason").value = ""
}

function addResultToTable(pDate, pHour, pDoctors, pEspecialidad, pReason) {
    var table = document.getElementById("userTableClient");
    
    var row = table.insertRow(1)
        
    row.insertCell(0).innerHTML = pDate;
    row.insertCell(1).innerHTML = pHour
    row.insertCell(2).innerHTML = pDoctors;
    row.insertCell(3).innerHTML = pEspecialidad;
    row.insertCell(4).innerHTML = pReason;
    
}

function addResultToStorage(pDate, pHour, pDoctors, pEspecialidad, pReason) {
    var addResultArray = [];

    //obtener el current logged user
    var currentLoggedUser = getCurrentLoggedUser()
    //console.log(currentLoggedUser.user)

    if (localStorage.getItem("lAddResultArray") !== null) {
        addResultArray = JSON.parse(localStorage.getItem("lAddResultArray"));
    }

    var current_add_result = {
        user: currentLoggedUser.user,
        date1: pDate,
        hour: pHour,
        doctors: pDoctors,
        especialidad: pEspecialidad,
        reason: pReason
    }

    addResultArray.push(current_add_result)
    localStorage.setItem("lAddResultArray", JSON.stringify(addResultArray));

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

/*
************* dashboard functionality add admin
*/
if (window.location.href.includes("dashboard")) {
    var currentLoggedUser = getCurrentLoggedUser()
    if (currentLoggedUser.role === "admin") {

        const elementToObserve = document.getElementById("admin")

        const observer = new MutationObserver(function () {
            var currentLoggedUser = getCurrentLoggedUser()
            loadDataFromAllPatients()
            loadAppointmentsDataFromAllUsers()
            
            observer.disconnect()
        });

        observer.observe(elementToObserve, { subtree: true, childList: true });
    }
}

function loadAppointmentsDataFromAllUsers() {
    var addResultArray
    if (localStorage.getItem("lAddResultArray") !== null) {
        addResultArray = JSON.parse(localStorage.getItem("lAddResultArray"));
    }

    var userTableAdmin = document.getElementById("userTableAdmin")
    var row
    var index = 0;
    //var tableIndex = addResultArray

    for (var addResult of addResultArray) {
        row = userTableAdmin.insertRow(1)

        row.insertCell(0).innerHTML = addResult.user;
        row.insertCell(1).innerHTML = addResult.date1;
        row.insertCell(2).innerHTML = addResult.hour;
        row.insertCell(3).innerHTML = addResult.doctors;
        row.insertCell(4).innerHTML = addResult.especialidad;
        row.insertCell(5).innerHTML = addResult.reason;
        row.insertCell(6).innerHTML = "<button onclick='modifyOnElementByIndex(" + index + ")'>modify</button><input type='hidden' id='" + index + "'>";
        row.insertCell(7).innerHTML = "<button onclick='deleteElementByIndex(" + index + ")'>delete</button><input type='hidden' id='" + index + "'>";
        index++
    }
}

function loadDataFromAllPatients() {
    var initialFormArray
    if (localStorage.getItem("lInitialFormArray") !== null) {
        initialFormArray = JSON.parse(localStorage.getItem("lInitialFormArray"));
    }

    var patientTableAdmin = document.getElementById("PatientTableAdmin")
    var row
    var index = 0;
    //var tableIndex = addResultArray

    for (var initialForm of initialFormArray) {
        row = patientTableAdmin.insertRow(1)

        row.insertCell(0).innerHTML = initialForm.user;
        row.insertCell(1).innerHTML = initialForm.date;
        row.insertCell(2).innerHTML = initialForm.name;
        row.insertCell(3).innerHTML = initialForm.address;
        row.insertCell(4).innerHTML = initialForm.datebirth;
        row.insertCell(5).innerHTML = initialForm.sex;
        row.insertCell(6).innerHTML = initialForm.civil;
        row.insertCell(7).innerHTML = initialForm.tel;
        row.insertCell(8).innerHTML = initialForm.cel;
        row.insertCell(9).innerHTML = initialForm.mail;
        row.insertCell(10).innerHTML = "<button onclick='modifyOnElementByIndex(" + index + ")'>modify</button><input type='hidden' id='" + index + "'>";
        row.insertCell(11).innerHTML = "<button onclick='deleteElementByIndex(" + index + ")'>delete</button><input type='hidden' id='" + index + "'>";
        index++
    }
}

function deleteElementByIndex(pIndex) {
    //que es lo que implica eliminar un elemento?
    //1. quitarlo del local storage
    deleteElementFromLocalStorage(pIndex)
    //2. quitarlo de la tabla
    deleteElementFromTable(pIndex)

}

function deleteElementFromLocalStorage(pIndex) {
    var addResultArray = JSON.parse(localStorage.getItem("lAddResultArray"))
    addResultArray.splice(pIndex, 1)
    localStorage.setItem("lAddResultArray", JSON.stringify(addResultArray))
}

function deleteElementFromTable(pIndex) {
    var element = document.getElementById(pIndex)
    var parent = getElementParent(element, 3)
    var child = getElementParent(element, 2)
    parent.removeChild(child)
}

function modifyOnElementByIndex(pIndex) {
    var element = document.getElementById(pIndex)
    var parent = getElementParent(element, 2)
    console.log(parent.children)
    var children = parent.children
    children[1].innerHTML = "<input type='number' id='inpNum" + pIndex + "' value='" + children[1].innerText + "'>"
    children[2].innerHTML = "<input type='number' id='inpNum" + pIndex + "' value='" + children[2].innerText + "'>"
    children[4].innerHTML = "<button onclick='modifyOffElementByIndex(" + pIndex + ",1)'>save</button><button onclick='modifyOffElementByIndex(" + pIndex + ",0)'>modify off</button><input type='hidden' id='" + pIndex + "'>"
}

function modifyOffElementByIndex(pIndex, pSave) {

}

function getElementParent(pElement, pGen) {
    var parent = pElement
    for (var i = 0; i < pGen; i++) {
        parent = parent.parentNode
    }
    return parent
}


/*
************* dashboard functionality add admin
*/
