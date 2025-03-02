// Prayer Times Class - Simplified for beginners
class PrayerTimes {
    constructor() {
        // Store DOM elements we need to update
        this.prayerCards = document.querySelectorAll('.prayer-card');
        this.nextPrayerText = document.querySelector('.next-prayer p');
        this.countdown = document.querySelector('.countdown');
        this.progress = document.querySelector('.progress-bar .progress');

        // List of prayer names in order
        this.prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        // Start the app
        this.init();
    }

    // Initialize the app
    async init() {
        try {
            // First, set the prayer names in the cards
            this.setPrayerNames();
            
            // Then get prayer times from API
            await this.getPrayerTimes();
            
            // Start the countdown timer
            this.startCountdown();
        } catch (error) {
            console.error('Failed to initialize:', error);
            this.showError();
        }
    }

    // Set prayer names in the cards
    setPrayerNames() {
        this.prayerCards.forEach((card, index) => {
            card.querySelector('.prayer-name').textContent = this.prayers[index];
        });
    }

    // Get prayer times from API using axios
    async getPrayerTimes() {
        try {
            // Get user's location
            const location = await this.getLocation();

            // Make API request using axios
            const response = await axios.get(
                `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}`, {
                    params: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        method: 2
                    }
                }
            );

            // Check if response is successful
            if (response.status === 200) {
                const times = response.data.data.timings;
                
                // Update prayer times on cards
                this.prayerCards.forEach(card => {
                    const name = card.querySelector('.prayer-name').textContent;
                    const time = this.formatTime(times[name]);
                    card.querySelector('.prayer-time').textContent = time;
                });

                // Save times for countdown
                this.times = times;
            } else {
                throw new Error('Failed to get prayer times');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Get user's location
    async getLocation() {
        try {
            // Try to get user's location
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            return {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
        } catch (error) {
            console.log('Using default location (Mecca)');
            // Return Mecca coordinates as default
            return {
                // Mecca coordinates
                latitude: 21.4225,
                longitude: 39.8262
            };
        }
    }

    // Format time to 12-hour format
    formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // Start countdown timer
    startCountdown() {
        // Update immediately
        this.updateCountdown();
        // Then update every second
        setInterval(() => this.updateCountdown(), 1000);
    }

    // Update countdown display
    updateCountdown() {
        if (!this.times) return;

        // Get current time
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        // Find next prayer
        let nextPrayer = this.prayers[0];
        for (const prayer of this.prayers) {
            if (this.times[prayer] > currentTime) {
                nextPrayer = prayer;
                break;
            }
        }

        // Calculate time difference
        const [hours, minutes] = this.times[nextPrayer].split(':');
        const prayerTime = new Date();
        prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        let diff = prayerTime - now;
        if (diff < 0) {
            diff += 24 * 60 * 60 * 1000; // Add 24 hours
        }

        // Convert to hours, minutes, seconds
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        // Update display
        this.nextPrayerText.textContent = `Next Prayer: ${nextPrayer}`;
        this.countdown.textContent = 
            `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        // Update progress bar
        const progress = (diff / (24 * 60 * 60 * 1000)) * 100;
        this.progress.style.width = `${100 - progress}%`;
    }

    // Show error message
    showError() {
        this.prayerCards.forEach(card => {
            card.querySelector('.prayer-time').textContent = '--:--';
        });
        this.nextPrayerText.textContent = 'Next Prayer: --:--';
        this.countdown.textContent = '--:--:--';
        this.progress.style.width = '0%';
    }
}

// Start the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.prayer-times')) {
        new PrayerTimes();
    }
});

// Mobile Menu Toggle (keep existing code)
class MobileMenu {
    // ... (keep existing mobile menu code)
}

// Initialize mobile menu
new MobileMenu();

// Verse of the Day Class
class VerseOfTheDay {
    constructor() {
        // Initialize only if elements exist
        this.arabicText = document.querySelector('.arabic-text');
        this.translation = document.querySelector('.verse-translation');
        this.playButton = document.querySelector('.verse-btn.play');
        this.shareButton = document.querySelector('.verse-btn.share');
        this.audio = new Audio();

        // Only initialize if elements are found
        if (this.arabicText && this.translation) {
            this.init();
            this.setupEventListeners();
        }
    }

    async init() {
        try {
            await this.fetchVerse();
        } catch (error) {
            console.error('Failed to initialize verse:', error);
            this.showError();
        }
    }

    async fetchVerse() {
        try {
            // Get a random verse from Surah Al-Baqarah (surah number 2)
            const response = await axios.get('https://api.alquran.cloud/v1/surah/2/en.asad');
            
            if (response.status === 200) {
                const surah = response.data.data;
                // Get a random verse from the surah
                const verseIndex = Math.floor(Math.random() * surah.numberOfAyahs);
                const verse = surah.ayahs[verseIndex];

                // Get the Arabic text for the same verse
                const arabicResponse = await axios.get(`https://api.alquran.cloud/v1/ayah/${verse.number}/ar.alafasy`);
                
                if (arabicResponse.status === 200) {
                    // Update the UI
                    this.arabicText.textContent = arabicResponse.data.data.text;
                    this.translation.textContent = verse.text;
                    
                    // Store audio URL for later playback
                    this.audio.src = arabicResponse.data.data.audio;
                }
            }
        } catch (error) {
            console.error('Failed to fetch verse:', error);
            throw error;
        }
    }

    setupEventListeners() {
        if (this.playButton) {
            this.playButton.addEventListener('click', () => this.toggleAudio());
        }
        if (this.shareButton) {
            this.shareButton.addEventListener('click', () => this.shareVerse());
        }
    }

    toggleAudio() {
        if (this.audio.paused) {
            this.audio.play()
                .then(() => {
                    this.playButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
                })
                .catch(() => {
                    console.error('Failed to play audio');
                    this.playButton.innerHTML = '<i class="fas fa-play"></i> Play Audio';
                });
        } else {
            this.audio.pause();
            this.playButton.innerHTML = '<i class="fas fa-play"></i> Play Audio';
        }
    }

    shareVerse() {
        const text = `${this.arabicText.textContent}\n\n${this.translation.textContent}\n- Shared from Ramadan Hub`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Verse of the Day - Ramadan Hub',
                text: text
            }).catch(error => console.error('Error sharing:', error));
        } else {
            navigator.clipboard.writeText(text)
                .then(() => alert('Verse copied to clipboard!'))
                .catch(error => console.error('Error copying:', error));
        }
    }

    showError() {
        if (this.arabicText) {
            this.arabicText.textContent = 'Failed to load verse';
        }
        if (this.translation) {
            this.translation.textContent = 'Please try again later';
        }
    }
}

// Initialize classes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize PrayerTimes only if element exists
    if (document.querySelector('.prayer-times')) {
        new PrayerTimes();
    }
    
    // Initialize VerseOfTheDay only if elements exist
    if (document.querySelector('.verse')) {
        new VerseOfTheDay();
    }
});


// Function to get a random Hadith
async function getHadith() {
    try {
        let response = await fetch("https://api.hadith.gading.dev/books/bukhari?range=1-100");
        let data = await response.json();

        // Get a random Hadith
        let hadiths = data.data.hadiths;
        let randomIndex = Math.floor(Math.random() * hadiths.length);
        let hadithText = hadiths[randomIndex].arab;
        let hadithRef = `Book: Bukhari, Hadith No: ${hadiths[randomIndex].number}`;

    
        document.getElementById("hadith").innerText = hadithText;
        document.getElementById("reference").innerText = hadithRef;
    } catch (error) {
        console.error("Error fetching Hadith:", error);
        document.getElementById("hadith").innerText = "Failed to fetch Hadith. Try again.";
        document.getElementById("reference").innerText = "";
    }
}


window.onload = getHadith;