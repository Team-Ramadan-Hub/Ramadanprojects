// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector(".login-form");
    const messageElement = document.querySelector(".message");
    const signInLink = document.getElementById("sign-in-link");
    const userProfile = document.getElementById("user-profile");

    checkLoginStatus();
 
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
 
        if (!username || !password) {
            showMessage("Please fill in all fields", true);
            return;
        }
        

        const users = JSON.parse(localStorage.getItem("users") || "[]");
 
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {

            localStorage.setItem("currentUser", JSON.stringify({
                name: user.name,
                username: user.username
            }));

            showMessage("Login successful! Redirecting...", false);
    
            updateUIForLoggedInUser(user.username);
     
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
    
            showMessage("Invalid username or password", true);
        }
    });

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem("currentUser");
            updateUIForLoggedOutUser();
            showMessage("Logged out successfully", false);
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
    

    function showMessage(text, isError) {
        if (messageElement) {
            messageElement.textContent = text;
            messageElement.className = isError ? "message error" : "message";
        }
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
