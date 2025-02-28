



  
const button = document.querySelector(".signup-button")


button.addEventListener("click", function(event){
    event.preventDefault();
    const inputName = document.getElementById("name").value;
const inputUsername = document.getElementById("username").value;
const inputPassword = document.getElementById("password").value;

const formData = {
    name: inputName,
    username: inputUsername,
    password: inputPassword

};
    localStorage.setItem("signupData", JSON.stringify(formData));

    alert("Form data saved in local storage!");

});





