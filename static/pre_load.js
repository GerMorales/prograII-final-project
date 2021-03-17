
/*
preload information to local storage users
*/
function preLoadUsers() {

    var userArray = [{
        user: "bal",
        password: "123",
        role: "admin"
    }, {
        user: "rod",
        password: "234",
        role: "client"
    }, {
        user: "ted",
        password: "345",
        role: "client"
    }]

    localStorage.setItem("lUserArray", JSON.stringify(userArray))
}

preLoadUsers()