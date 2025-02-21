const teamMembers = [
  { name: "Hanni", role: "Team Lead", img: "/image/hanni.png" },
  { name: "Mohamud", role: "Team Member", img: "/image/heriImg.jpg" },
  { name: "Abdulkareem", role: "Team Member", img: "/image/abdikarem.png" },
  { name: "Abdullahi", role: "Team Member", img: "/image/abdull2.png" },
  { name: "Abdirahman", role: "Team Member", img: "/image/abdirahman.jpg" },
  { name: "Abdirashid", role: "Team Member", img: "/image/rashid.jpg" },
];

const teamContainer = document.getElementById("teamContainer");

teamMembers.forEach((member) => {
  const memberDiv = document.createElement("div");
  memberDiv.classList.add("member");
  memberDiv.innerHTML = `
          <img src="${member.img}" alt="${member.name}">
          <h3>${member.name}</h3>
          <p>${member.role}</p>
      `;
  teamContainer.appendChild(memberDiv);
});
document.addEventListener("DOMContentLoaded", async function () {
    await fetchPrayerTimes();
});

async function fetchPrayerTimes() {
    try {
        const response = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Mogadishu&country=Somalia&method=2");
        const data = await response.json();
        const timings = data.data.timings;

        // Convert prayer times to 12-hour format with AM/PM
        const prayerTimes = {
            "Fajar": formatTime(timings.Fajr),
            "Dhuhr": formatTime(timings.Dhuhr),
            "Asr": formatTime(timings.Asr),
            "Maghrib": formatTime(timings.Maghrib),
            "Isha": formatTime(timings.Isha)
        };

        console.log("Fetched Prayer Times:", prayerTimes); // Debugging log

        // Update ALL prayer times, including Fajr
        document.querySelectorAll(".prayer-item").forEach(item => {
            const prayerName = item.querySelector(".prayer-name").textContent.trim();
            if (prayerTimes[prayerName]) {
                item.querySelector(".prayer-time").textContent = prayerTimes[prayerName];
            }
        });

        // Start countdown and loading bar update
        updateNextPrayer(prayerTimes);
        setInterval(() => updateNextPrayer(prayerTimes), 1000);
    } catch (error) {
        console.error("Error fetching prayer times:", error);
    }
}

// Convert API time to 12-hour format with AM/PM
function formatTime(timeStr) {
    let [hours, minutes] = timeStr.split(":").map(Number);
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

// Update next prayer countdown and loading bar
function updateNextPrayer(prayerTimes) {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    let nextPrayerName = "";
    let nextPrayerTimeInMinutes = null;

    // Find next prayer time
    for (const [name, time] of Object.entries(prayerTimes)) {
        const [hours, minutes] = time.replace(/AM|PM/, "").split(":").map(Number);
        const isPM = time.includes("PM") && hours !== 12;
        const prayerTimeInMinutes = (isPM ? hours + 12 : hours) * 60 + minutes;

        if (prayerTimeInMinutes > currentTimeInMinutes) {
            nextPrayerName = name;
            nextPrayerTimeInMinutes = prayerTimeInMinutes;
            break;
        }
    }

    // If no more prayers today, show tomorrow's Fajr
    if (!nextPrayerTimeInMinutes) {
        nextPrayerName = "Fajar";
        const [hours, minutes] = prayerTimes.Fajar.replace(/AM|PM/, "").split(":").map(Number);
        nextPrayerTimeInMinutes = 24 * 60 + (hours * 60 + minutes);
    }

    // Calculate countdown
    const remainingMinutes = nextPrayerTimeInMinutes - currentTimeInMinutes;
    const remainingSeconds = remainingMinutes * 60 - now.getSeconds();
    const hoursLeft = Math.floor(remainingSeconds / 3600);
    const minutesLeft = Math.floor((remainingSeconds % 3600) / 60);
    const secondsLeft = remainingSeconds % 60;

    // Update UI
    document.querySelector(".next-prayer-box p").textContent = `Next Prayer: ${nextPrayerName}`;
    document.querySelector(".next-prayer-time").textContent =
        `${String(hoursLeft).padStart(2, "0")}:${String(minutesLeft).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;

    // Update loading bar
    const totalTimeBetweenPrayers = nextPrayerTimeInMinutes - currentTimeInMinutes;
    const progress = (remainingMinutes / totalTimeBetweenPrayers) * 100;
    document.querySelector(".loading-bar").style.width = `${progress}%`;
}
