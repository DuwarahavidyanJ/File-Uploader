var x = document.getElementById("login");
var y = document.getElementById("signup");
var z = document.getElementById("btn");

function signup(){
    x.style.left = "-400px";
    y.style.left = "50px";
    z.style.left = "100px";
}

function login(){
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "0px";
}


document.querySelector('.submit-btn').onclick = function () {
    let create_password = document.querySelector('#createPassword').value;
    let confirm_password = document.querySelector('#confirmPassword').value;
    let email = document.querySelector('#email').value; // Assuming your email input has an id of 'email'

    // Check if passwords match
    if (create_password !== confirm_password) {
        alert("Passwords do not match");
        return false;
    }

    // Check if password meets the required criteria
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(create_password)) {
        alert("Password must be at least 8 characters and include letters, numbers, and symbols");
        return false;
    }


};










// let eyeicon = document.getElementById("eyeicon");
// let createPassword = document.getElementById("createPassword");

// eyeicon.onclick = function(){
//     if(password.type == "password"){
//         password.type = "text"
//     }else{
//         password.type = "password"
//     }
// }

// let eyeicon = document.getElementById("eyeicon");
// let confirmPassword = document.getElementById("confirmPassword");

// eyeicon.onclick = function(){
//     if(password.type == "password"){
//         password.type = "text"
//     }else{
//         password.type = "password"
//     }
// }
