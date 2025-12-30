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
      alert("Enter text or URL");
      return;
    }

    output.innerHTML = "";
    if (spinner) spinner.style.display = "block";

    QRCode.toCanvas(text, { width: 300 }, (err, canvas) => {
      if (spinner) spinner.style.display = "none";
      if (err) {
        alert("QR generation failed");
        return;
      }

      const ctx = canvas.getContext("2d");

      const finish = () => {
        output.innerHTML = "";
        output.appendChild(canvas);
        if (downloadBtn) downloadBtn.href = canvas.toDataURL("image/png");
      };

      // Logo watermark
      if (logoFile) {
        const reader = new FileReader();
        const logo = new Image();

        reader.onload = () => {
          logo.onload = () => {
            const size = canvas.width * 0.25;
            const x = (canvas.width - size) / 2;
            const y = (canvas.height - size) / 2;

            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, 12);
            ctx.fill();

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
    if (textEl) textEl.textContent = "Decoding…";
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
              copyBtn.textContent = "Copied!";
              setTimeout(() => (copyBtn.textContent = "Copy Text"), 1500);
            };
          }
        } else {
          textEl.textContent = "No QR code found";
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
