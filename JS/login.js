


const form = document.querySelector(".login-form")
    form.addEventListener("submit",(event) => {
        event.preventDefault()
        const message = document.querySelector(".message")
        const storedData = localStorage.getItem("signupData");
        if(storedData){
            const formData = JSON.parse(storedData);
            const username =  document.getElementById("username").value 
            
           const password = document.getElementById("password").value 
           if(formData.username == username && formData.password == password){

            console.log("login susscessfull")
            message.textContent = "login successfull"
           }
           else{ console.log ("invalid password")
            message.textContent = "invalid password"
           }

          
    };
    

    })
       

