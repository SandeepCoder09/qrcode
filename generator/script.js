/* ================= THEME TOGGLE ================= */
const themeBtn = document.getElementById("themeToggle");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme");

    if (current === "dark") {
      root.setAttribute("data-theme", "light");
      themeBtn.textContent = "🌙";
    } else {
      root.setAttribute("data-theme", "dark");
      themeBtn.textContent = "☀️";
    }
  });
}

/* ================= QR GENERATOR ================= */
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

    output.innerHTML = "";
    if (spinner) spinner.style.display = "block";

    // Set errorCorrectionLevel to 'H' (High) to allow for center obstruction
    QRCode.toCanvas(text, { 
      width: 600, // Higher resolution for better quality
      margin: 2,
      errorCorrectionLevel: 'H' 
    }, (err, canvas) => {
      if (spinner) spinner.style.display = "none";
      if (err) {
        alert("QR generation failed");
        return;
      }

      const ctx = canvas.getContext("2d");
      const size = canvas.width * 0.24; // Logo/Space size (24% of QR)
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;

      const finish = () => {
        output.innerHTML = "";
        output.appendChild(canvas);
        if (downloadBtn) {
            downloadBtn.style.display = "block";
            downloadBtn.href = canvas.toDataURL("image/png");
        }
      };

      // 1. ALWAYS Draw the blank white center space
      ctx.fillStyle = "#ffffff";
      // Draw a smooth rounded rectangle for the center "pocket"
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x - 5, y - 5, size + 10, size + 10, 15); // Slightly larger than logo for padding
        ctx.fill();
      } else {
        ctx.fillRect(x - 5, y - 5, size + 10, size + 10);
      }

      // 2. Draw Logo if provided, otherwise just finish with the blank space
      if (logoFile) {
        const reader = new FileReader();
        const logo = new Image();

        reader.onload = () => {
          logo.onload = () => {
            // Draw the actual logo inside the white space
            ctx.drawImage(logo, x, y, size, size);
            finish();
          };
          logo.src = reader.result;
        };
        reader.readAsDataURL(logoFile);
      } else {
        finish();
      }
    });
  });
}

/* ================= QR DECODER ================= */
const qrImage = document.getElementById("qrImage");

if (qrImage && typeof jsQR !== "undefined") {
  qrImage.addEventListener("change", () => {
    const file = qrImage.files[0];
    if (!file) return;

    const spinner = document.getElementById("decodeSpinner");
    const textEl = document.getElementById("decodedText");
    const copyBtn = document.getElementById("copyBtn");
    const canvas = document.getElementById("decodeCanvas");
    const ctx = canvas?.getContext("2d");

    if (spinner) spinner.style.display = "block";
    if (textEl) textEl.textContent = "Analyzing image...";
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
              copyBtn.style.background = "#28a745";
              setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = "";
              }, 2000);
            };
          }
        } else {
          textEl.textContent = "Could not find a valid QR code. Try a clearer image.";
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
