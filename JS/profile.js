// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const profileName = document.getElementById('profile-name');
    const profileUsername = document.getElementById('profile-username');
    const joinDate = document.getElementById('join-date');
    const infoName = document.getElementById('info-name');
    const infoUsername = document.getElementById('info-username');
    const infoCreated = document.getElementById('info-created');
    const editProfileButton = document.getElementById('edit-profile-button');
    const logoutProfileButton = document.getElementById('logout-profile-button');
    const signInLink = document.getElementById('sign-in-link');
    const userProfile = document.getElementById('user-profile');
    

    checkLoginStatus();
    

    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', function() {
            profileDropdown.classList.toggle('active');
        });
        
    
        document.addEventListener('click', function(event) {
            if (!profileButton.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    }
    

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    if (logoutProfileButton) {
        logoutProfileButton.addEventListener('click', handleLogout);
    }
    

    if (editProfileButton) {
        editProfileButton.addEventListener('click', function() {

            alert('Edit profile functionality will be implemented in a future update.');
        });
    }

    function handleLogout() {
        localStorage.removeItem('currentUser');

        window.location.href = 'index.html';
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function loadUserProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {

            window.location.href = 'login.html';
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userData = users.find(user => user.username === currentUser.username);
        
        if (!userData) {
            console.error('User data not found');
            return;
        }
        
        profileName.textContent = userData.name;
        profileUsername.textContent = `@${userData.username}`;
        infoName.textContent = userData.name;
        infoUsername.textContent = userData.username;
        

        if (userData.createdAt) {
            const formattedDate = formatDate(userData.createdAt);
            joinDate.textContent = formattedDate;
            infoCreated.textContent = formattedDate;
        }
    }

    if (window.location.pathname.includes('profile.html')) {
        loadUserProfile();
    }
});


function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        updateUIForLoggedInUser(currentUser.username);
    } else {
        updateUIForLoggedOutUser();

        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'login.html';
        }
    }
}

function updateUIForLoggedInUser(username) {
    const signInLink = document.getElementById('sign-in-link');
    const userProfile = document.getElementById('user-profile');
    const usernameDisplay = document.getElementById('username-display');
    
    if (signInLink) signInLink.style.display = 'none';
    if (userProfile) userProfile.style.display = 'block';
    if (usernameDisplay) usernameDisplay.textContent = username;
}

function updateUIForLoggedOutUser() {
    const signInLink = document.getElementById('sign-in-link');
    const userProfile = document.getElementById('user-profile');
    
    if (signInLink) signInLink.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
}
