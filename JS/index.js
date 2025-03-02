// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const signInLink = document.querySelector(".sign-in");
    const navControls = document.querySelector(".nav-controls");
    

    if (!document.getElementById("user-profile")) {

        const userProfileHTML = `
            <div id="user-profile" style="display: none;">
                <button id="profile-button" class="profile-button">
                    <i class="fas fa-user"></i>
                    <span id="username-display">Username</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div id="profile-dropdown" class="profile-dropdown">
                    <a href="./profile.html">
                        <i class="fas fa-user-circle"></i>
                        My Profile
                    </a>
                    <a href="#" id="logout-button">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                </div>
            </div>
        `;

        if (navControls) {
            navControls.insertAdjacentHTML('beforeend', userProfileHTML);
        }
    }

    checkLoginStatus();

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", function(event) {
            event.preventDefault();
            localStorage.removeItem("currentUser");
            updateUIForLoggedOutUser();
 
            window.location.href = "index.html";
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
    const signInLink = document.querySelector(".sign-in");
    const userProfile = document.getElementById("user-profile");
    const usernameDisplay = document.getElementById("username-display");
    
    if (signInLink) signInLink.style.display = "none";
    if (userProfile) userProfile.style.display = "block";
    if (usernameDisplay) usernameDisplay.textContent = username;
}


function updateUIForLoggedOutUser() {
    const signInLink = document.querySelector(".sign-in");
    const userProfile = document.getElementById("user-profile");
    
    if (signInLink) signInLink.style.display = "block";
    if (userProfile) userProfile.style.display = "none";
}

if (!document.querySelector('style#profile-dropdown-styles')) {
    const profileStyles = document.createElement('style');
    profileStyles.id = 'profile-dropdown-styles';
    profileStyles.textContent = `
        #user-profile {
            position: relative;
            display: none;
        }
        
        .profile-button {
            display: flex;
            align-items: center;
            background: var(--primary-color, #2E7D32);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            gap: 8px;
        }
        
        .profile-button:hover {
            background: var(--primary-dark, #1B5E20);
        }
        
        .profile-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            width: 200px;
            display: none;
            z-index: 100;
        }
        
        .profile-dropdown.active {
            display: block;
        }
        
        .profile-dropdown a {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            color: #333;
            text-decoration: none;
            transition: background-color 0.2s;
        }
        
        .profile-dropdown a:hover {
            background-color: #f5f5f5;
        }
        
        .profile-dropdown a i {
            width: 16px;
        }
    `;
    document.head.appendChild(profileStyles);
}
