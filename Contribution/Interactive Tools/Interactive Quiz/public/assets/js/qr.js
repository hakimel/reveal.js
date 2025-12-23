// placeholder if you want to generate QR elsewhere
document.addEventListener("DOMContentLoaded", () => {
  const qrContainer = document.getElementById("qrcode");
  if (qrContainer) {
    new QRCode(qrContainer, {
      text: window.location.origin + "/quiz.html", // e.g., http://localhost:3000/quiz.html
      width: 250,
      height: 250,
    });

    // Optional helper text
    const info = document.createElement("p");
    info.textContent = "Scan to join the quiz!";
    info.style.fontSize = "14px";
    info.style.textAlign = "center";
    qrContainer.appendChild(info);
  }
});
