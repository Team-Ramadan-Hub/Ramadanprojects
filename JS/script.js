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
