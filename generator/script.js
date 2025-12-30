/**
 * 09 QR Studio - Complete Logic
 * Includes: Theme Toggle, Enhanced Generator (with Auto-branding), and Decoder.
 */

/* ================= 1. THEME TOGGLE ================= */
const themeBtn = document.getElementById("themeToggle");

if (themeBtn) {
  // Check for saved preference or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  themeBtn.addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeBtn.textContent = next === "dark" ? "☀️" : "🌙";
  });
}

/* ================= 2. QR GENERATOR (WITH 09 BRANDING) ================= */
const generateBtn = document.getElementById("generateBtn");

if (generateBtn && typeof QRCode !== "undefined") {
  generateBtn.addEventListener("click", () => {
    const text = document.getElementById("qrText")?.value.trim();
    const logoFile = document.getElementById("logoInput")?.files[0];
    const output = document.getElementById("qrOutput");
    const downloadBtn = document.getElementById("downloadBtn");
    const spinner = document.getElementById("loadingSpinner");

    if (!text) {
      alert("Please enter a URL or text first!");
      return;
    }

    // Reset UI
    output.innerHTML = "";
    if (spinner) spinner.style.display = "block";
    if (downloadBtn) downloadBtn.style.display = "none";

    // Generate high-res QR with Level 'H' Error Correction
    // This allows up to 30% of the center to be covered
    QRCode.toCanvas(text, { 
      width: 600, 
      margin: 2, 
      errorCorrectionLevel: 'H',
      color: {
        dark: "#030711", 
        light: "#ffffff"
      }
    }, (err, canvas) => {
      if (spinner) spinner.style.display = "none";
      if (err) {
        alert("Generation failed!");
        return;
      }

      const ctx = canvas.getContext("2d");
      const size = canvas.width * 0.22; // Branding size
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;

      const finalizeUI = () => {
        output.innerHTML = "";
        output.appendChild(canvas);
        if (downloadBtn) {
          downloadBtn.style.display = "block";
          downloadBtn.href = canvas.toDataURL("image/png");
        }
      };

      // A. DRAW CENTER PROTECTIVE SPACE (Rounded White Box)
      ctx.fillStyle = "#ffffff";
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x - 8, y - 8, size + 16, size + 16, 20);
        ctx.fill();
      } else {
        ctx.fillRect(x - 8, y - 8, size + 16, size + 16);
      }

      // B. DRAW LOGO OR DEFAULT "09"
      if (logoFile) {
        const reader = new FileReader();
        const logo = new Image();
        reader.onload = () => {
          logo.onload = () => {
            ctx.drawImage(logo, x, y, size, size);
            finalizeUI();
          };
          logo.src = reader.result;
        };
        reader.readAsDataURL(logoFile);
      } else {
        // Draw Default "09" Branding
        // 1. Blue Circle
        ctx.fillStyle = "#00aaff";
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();

        // 2. White "09" Text
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${size * 0.45}px 'Poppins', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("09", x + size / 2, y + size / 2 + 2);
        
        finalizeUI();
      }
    });
  });
}

/* ================= 3. QR DECODER ================= */
const qrImageInput = document.getElementById("qrImage");

if (qrImageInput && typeof jsQR !== "undefined") {
  qrImageInput.addEventListener("change", () => {
    const file = qrImageInput.files[0];
    if (!file) return;

    const spinner = document.getElementById("decodeSpinner");
    const textEl = document.getElementById("decodedText");
    const copyBtn = document.getElementById("copyBtn");
    const canvas = document.getElementById("decodeCanvas");
    const ctx = canvas?.getContext("2d");

    if (spinner) spinner.style.display = "block";
    if (textEl) textEl.textContent = "Processing...";
    if (copyBtn) copyBtn.style.display = "none";

    const reader = new FileReader();
    const img = new Image();

    reader.onload = () => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (spinner) spinner.style.display = "none";

        if (code) {
          textEl.textContent = code.data;
          if (copyBtn) {
            copyBtn.style.display = "block";
            copyBtn.onclick = () => {
              navigator.clipboard.writeText(code.data);
              const originalText = copyBtn.textContent;
              copyBtn.textContent = "✓ Copied!";
              copyBtn.style.borderColor = "#28a745";
              copyBtn.style.color = "#28a745";
              setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.borderColor = "";
                copyBtn.style.color = "";
              }, 2000);
            };
          }
        } else {
          textEl.textContent = "No valid QR code detected. Try a higher quality image.";
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
