
document.addEventListener('DOMContentLoaded', function() {

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav__menu');
    const overlay = document.querySelector('.overlay');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
 
            if (!overlay) {
                const newOverlay = document.createElement('div');
                newOverlay.className = 'overlay';
                document.body.appendChild(newOverlay);
  
                newOverlay.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    newOverlay.classList.remove('active');
                });
                

                setTimeout(() => {
                    newOverlay.classList.add('active');
                }, 10);
            } else {
                overlay.classList.toggle('active');

                overlay.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
        });
    }

    const navLinks = document.querySelectorAll('.nav__menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            if (overlay) {
                overlay.classList.remove('active');
            }
        }
    });
});
