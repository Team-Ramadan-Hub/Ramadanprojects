document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector(".signup-form");
    const signInLink = document.getElementById("sign-in-link");
    const userProfile = document.getElementById("user-profile");

    checkLoginStatus();

    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const inputName = document.getElementById("name").value.trim();
        const inputUsername = document.getElementById("username").value.trim();
        const inputPassword = document.getElementById("password").value.trim();
 
        if (!inputName || !inputUsername || !inputPassword) {
            alert("Please fill in all fields");
            return;
        }
 
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const userExists = existingUsers.some(user => user.username === inputUsername);
        
        if (userExists) {
            alert("Username already exists. Please choose another one.");
            return;
        }

        const userData = {
            name: inputName,
            username: inputUsername,
            password: inputPassword,
            createdAt: new Date().toISOString()
        };
        

        existingUsers.push(userData);
        localStorage.setItem("users", JSON.stringify(existingUsers));
 
        localStorage.setItem("currentUser", JSON.stringify({
            name: inputName,
            username: inputUsername
        }));

        updateUIForLoggedInUser(inputUsername);

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    });
    

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem("currentUser");
            updateUIForLoggedOutUser();
        });
    }

    const profileButton = document.getElementById("profile-button");
    const profileDropdown = document.getElementById("profile-dropdown");
    
    if (profileButton && profileDropdown) {
        profileButton.addEventListener("click", function() {
            profileDropdown.classList.toggle("active");
        });

        document.addEventListener("click", function(event) {
            if (!profileButton.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.classList.remove("active");
            }
        });
    }
});

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser) {
        updateUIForLoggedInUser(currentUser.username);
    } else {
        updateUIForLoggedOutUser();
    }
}

function updateUIForLoggedInUser(username) {
    const signInLink = document.getElementById("sign-in-link");
    const userProfile = document.getElementById("user-profile");
    const usernameDisplay = document.getElementById("username-display");
    
    if (signInLink) signInLink.style.display = "none";
    if (userProfile) userProfile.style.display = "block";
    if (usernameDisplay) usernameDisplay.textContent = username;
}

function updateUIForLoggedOutUser() {
    const signInLink = document.getElementById("sign-in-link");
    const userProfile = document.getElementById("user-profile");
    
    if (signInLink) signInLink.style.display = "block";
    if (userProfile) userProfile.style.display = "none";
}
