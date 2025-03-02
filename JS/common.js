
document.addEventListener('DOMContentLoaded', function() {

    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            

            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            

            const icon = themeToggle.querySelector('i');
            if (isDarkMode) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
        
 
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
            const icon = themeToggle.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (!document.querySelector('style#dark-mode-styles')) {
        const darkModeStyles = document.createElement('style');
        darkModeStyles.id = 'dark-mode-styles';
        darkModeStyles.textContent = `
            body.dark-mode {
                background-color: #121212;
                color: #f5f5f5;
            }
            
            body.dark-mode .header,
            body.dark-mode .nav,
            body.dark-mode .footer {
                background-color: #1e1e1e;
            }
            
            body.dark-mode .card,
            body.dark-mode .profile-dropdown {
                background-color: #2d2d2d;
                color: #f5f5f5;
            }
            
            body.dark-mode input,
            body.dark-mode textarea,
            body.dark-mode select {
                background-color: #333;
                color: #f5f5f5;
                border-color: #444;
            }
            
            body.dark-mode a {
                color: #4CAF50;
            }
            
            body.dark-mode .profile-dropdown a {
                color: #f5f5f5;
            }
            
            body.dark-mode .profile-dropdown a:hover {
                background-color: #3d3d3d;
            }
        `;
        document.head.appendChild(darkModeStyles);
    }
});
