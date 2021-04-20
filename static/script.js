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
************* dashboard functionality add admin
Aquí volví a copiar lo que Balbino había hecho dado que estaba desactualizado.
*/
if (window.location.href.includes("dashboard")) {
    var currentLoggedUser = getCurrentLoggedUser()
    if (currentLoggedUser.role === "admin") {

        const elementToObserve = document.getElementById("admin")

        const observer = new MutationObserver(function () {
            var currentLoggedUser = getCurrentLoggedUser()
            loadAddDataFromAllUsers()
            loadDataFromAllPatients()
            loadRegisteredUsers()
            observer.disconnect()
        });

        observer.observe(elementToObserve, { subtree: true, childList: true });
    }
}


function loadDataFromAllPatients() {
    var initialFormArray
    if (localStorage.getItem("lInitialFormArray") !== null) {
        initialFormArray = JSON.parse(localStorage.getItem("lInitialFormArray"));
    }

    var patientTableAdmin = document.getElementById("patientTableAdmin")
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
        row.insertCell(7).innerHTML = initialForm.cp;
        row.insertCell(8).innerHTML = initialForm.tel;
        row.insertCell(9).innerHTML = initialForm.cel;
        row.insertCell(10).innerHTML = initialForm.mail;
        row.insertCell(11).innerHTML = "<button onclick='modifyOnAnswerByIndex(" + index + ")'>modificar</button><input type='hidden' id='" + index + "'>";
        row.insertCell(12).innerHTML = "<button onclick='deleteAnswerByIndex(" + index + ")'>borrar</button><input type='hidden' id='" + index + "'>";
        index++
    }

}

function loadAddDataFromAllUsers() {
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
        index++
    }

}
function loadRegisteredUsers(){
    var userArray
    var registeredAdmins = 0
    var registeredClients
    var registeredUsers = JSON.parse(localStorage.lUserArray).length

    if (localStorage.getItem("lUserArray") !== null) {
        userArray = JSON.parse(localStorage.getItem("lUserArray"));
    }

    for (var user of userArray) {
        if (user.role == "admin") {
            registeredAdmins += 1
        }
    }

    registeredClients = registeredUsers - registeredAdmins
    document.getElementById("users").innerHTML = "Hay "+registeredUsers+" usuarios registrados"
    document.getElementById("admins").innerHTML = "Hay "+registeredAdmins+" administradores registrados"
    document.getElementById("clients").innerHTML = "Hay "+registeredClients+" clientes registrados"
}


//Deleting answers from initial form
function deleteAnswerByIndex(pIndex) {
    deleteAnswerFromLocalStorage(pIndex)
    //2. quitarlo de la tabla
    deleteAnswerFromTable(pIndex)

}

function deleteAnswerFromLocalStorage(pIndex) {
    var initialFormArray = JSON.parse(localStorage.getItem("lInitialFormArray"))
    initialFormArray.splice(pIndex, 1)
    localStorage.setItem("lInitialFormArray", JSON.stringify(initialFormArray))
}

function deleteAnswerFromTable(pIndex) {
    var element = document.getElementById(pIndex)
    var parent = getElementParent(element, 3)
    var child = getElementParent(element, 2)
    parent.removeChild(child)
}

function modifyOnAnswerByIndex(pIndex) {
    var element = document.getElementById(pIndex)
    var parent = getElementParent(element, 2)
    console.log(parent.children)
    var children = parent.children
    children[1].innerHTML = "<input type='date' id='inpDate1" + pIndex + "' value='" + children[1].innerText + "'>"
    children[2].innerHTML = "<input type='text' id='inpName" + pIndex + "' value='" + children[2].innerText + "'>"
    children[3].innerHTML = "<input type='text' id='inpDir" + pIndex + "' value='" + children[3].innerText + "'>"
    children[4].innerHTML = "<input type='date' id='inpDB" + pIndex + "' value='" + children[4].innerText + "'>"
    children[5].innerHTML = "<input type='text' id='inpSex" + pIndex + "' value='" + children[5].innerText + "'>"
    children[6].innerHTML = "<input type='text' id='inpCivil" + pIndex + "' value='" + children[6].innerText + "'>"
    children[7].innerHTML = "<input type='text' id='inpCP" + pIndex + "' value='" + children[7].innerText + "'>"
    children[8].innerHTML = "<input type='number' id='inpTel" + pIndex + "' value='" + children[8].innerText + "'>"
    children[9].innerHTML = "<input type='number' id='inpCel" + pIndex + "' value='" + children[9].innerText + "'>"
    children[10].innerHTML = "<input type='text' id='inpMail" + pIndex + "' value='" + children[10].innerText + "'>"

    children[11].innerHTML = "<button onclick='modifyOffAnswerByIndex(" + pIndex + ",1)'>guardar</button><button onclick='modifyOffAnswerByIndex(" + pIndex + ",0)'>cancelar</button><input type='hidden' id='" + pIndex + "'>"
}

function modifyOffAnswerByIndex(pIndex, pSave) {
    var initialFormArray
    if (localStorage.getItem("lInitialFormArray") !== null) {
        initialFormArray = JSON.parse(localStorage.getItem("lInitialFormArray"));
    }

    var element = document.getElementById(pIndex)
    var parent = getElementParent(element, 2)
    var children = parent.children

    if(pSave===0){
        //modify off
        children[1].innerHTML = initialFormArray[pIndex].date
        children[2].innerHTML = initialFormArray[pIndex].name
        children[3].innerHTML = initialFormArray[pIndex].address
        children[4].innerHTML = initialFormArray[pIndex].datebirth
        children[5].innerHTML = initialFormArray[pIndex].sex
        children[6].innerHTML = initialFormArray[pIndex].civil
        children[7].innerHTML = initialFormArray[pIndex].cp
        children[8].innerHTML = initialFormArray[pIndex].tel
        children[9].innerHTML = initialFormArray[pIndex].cel
        children[10].innerHTML = initialFormArray[pIndex].mail

        children[11].innerHTML = "<button onclick='modifyOnElementByIndex(" + pIndex + ")'>modificar</button><input type='hidden' id='" + pIndex + "'>";

    } else {
        //save
        var input1 = document.getElementById("inpDate1"+pIndex).value
        var input2 = document.getElementById("inpName"+pIndex).value
        var input3 = document.getElementById("inpDir"+pIndex).value
        var input4 = document.getElementById("inpDB"+pIndex).value
        var input5 = document.getElementById("inpSex"+pIndex).value
        var input6 = document.getElementById("inpCivil"+pIndex).value
        var input7 = document.getElementById("inpCP"+pIndex).value
        var input8 = document.getElementById("inpTel"+pIndex).value
        var input9 = document.getElementById("inpCel"+pIndex).value
        var input10 = document.getElementById("inpMail"+pIndex).value

        initialFormArray[pIndex].date = input1
        initialFormArray[pIndex].name = input2
        initialFormArray[pIndex].address = input3
        initialFormArray[pIndex].datebirth = input4
        initialFormArray[pIndex].sex = input5
        initialFormArray[pIndex].civil = input6
        initialFormArray[pIndex].cp = input7
        initialFormArray[pIndex].tel = input8
        initialFormArray[pIndex].cel = input9
        initialFormArray[pIndex].mail = input10

        children[1].innerHTML = input1
        children[2].innerHTML = input2
        children[3].innerHTML = input3
        children[4].innerHTML = input4
        children[5].innerHTML = input5
        children[6].innerHTML = input6
        children[7].innerHTML = input7
        children[8].innerHTML = input8
        children[9].innerHTML = input9
        children[10].innerHTML = input10
        children[11].innerHTML = "<button onclick='modifyOnAnswerByIndex(" + pIndex + ")'>modificar</button><input type='hidden' id='" + pIndex + "'>";

        localStorage.setItem("lInitialFormArray", JSON.stringify(initialFormArray))
    }
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


function add() {
    var date1 = document.getElementById("date1").value
    var hour = document.getElementById("hour").value
    var doctors = document.getElementById("doctores").value
    var especialidad = document.getElementById("especialidad").value
    var reason = document.getElementById("reason").value

    cleanForm()
    addResultToTable(date1, hour, doctors, especialidad, reason)
    addResultToStorage(date1, hour, doctors, especialidad, reason)
    document.getElementById("messageC").innerHTML= "Su cita fue programada satisfactoriamente. Si por algún motivo no puede asistir, por favor agéndela nuevamente."

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
************* script of initial form
*/
function initialForm() {


    var date = document.getElementById("date").value
    var name = document.getElementById("name").value
    var address = document.getElementById("address").value
    var datebirth = document.getElementById("datebirth").value
    var sex = document.getElementById("sex").value
    var civil = document.getElementById("civil").value
    var cp = document.getElementById("cp").value
    var tel = document.getElementById("tel").value
    var cel = document.getElementById("cel").value
    var mail = document.getElementById("mail").value
    // 
    document.getElementById("message").innerHTML= "Sus datos fueron guardados correctamente. Si necesita actualizar su información, por favor llene el formulario nuevamente o contacte al administrador."
    
    cleanFormInitial()
    addFormToStorage(date, name, address, datebirth, sex, civil, cp, tel, cel, mail)

    
}
//
function cleanFormInitial() {

    var date = document.getElementById("date").value = ""
    var name = document.getElementById("name").value = ""
    var address = document.getElementById("address").value = ""
    var datebirth = document.getElementById("datebirth").value = ""
    var sex = document.getElementById("sex").value = ""
    var civil = document.getElementById("civil").value = ""
    var cp = document.getElementById("cp").value = ""
    var tel = document.getElementById("tel").value = ""
    var cel = document.getElementById("cel").value = ""
    var mail = document.getElementById("mail").value = ""

}    

function addFormToStorage(pDate, pName, pAddress, pDateBirth, pSex, pCivil, pCp, pTel, pCel, pMail) {
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
        cp: pCp,
        tel: pTel,
        cel: pCel,
        mail: pMail,
    }

    initialFormArray.push(current_form)
    localStorage.setItem("lInitialFormArray", JSON.stringify(initialFormArray));

}

/*
************* dashboard functionality add client
*/
