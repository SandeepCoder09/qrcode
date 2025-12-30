/**
 * 09 QR Studio - Complete Logic (v2.0)
 * Added: Live Camera Scanning
 */

/* ================= 1. THEME TOGGLE ================= */
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
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

    if (!text) { alert("Please enter text!"); return; }

    output.innerHTML = "";
    if (spinner) spinner.style.display = "block";

    QRCode.toCanvas(text, { 
      width: 600, 
      margin: 2, 
      errorCorrectionLevel: 'H' 
    }, (err, canvas) => {
      if (spinner) spinner.style.display = "none";
      if (err) return;

      const ctx = canvas.getContext("2d");
      const size = canvas.width * 0.22;
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;

      // Draw Center Protective Space
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - 8, y - 8, size + 16, size + 16, 20);
      else ctx.fillRect(x - 8, y - 8, size + 16, size + 16);
      ctx.fill();

      const finalizeUI = () => {
        output.innerHTML = "";
        output.appendChild(canvas);
        if (downloadBtn) {
          downloadBtn.style.display = "block";
          downloadBtn.href = canvas.toDataURL("image/png");
        }
      };

      if (logoFile) {
        const reader = new FileReader();
        const logo = new Image();
        reader.onload = () => {
          logo.onload = () => { ctx.drawImage(logo, x, y, size, size); finalizeUI(); };
          logo.src = reader.result;
        };
        reader.readAsDataURL(logoFile);
      } else {
        // Default "09" Branding
        ctx.fillStyle = "#00aaff";
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
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

/* ================= 3. QR DECODER (FILE + CAMERA) ================= */
const qrImageInput = document.getElementById("qrImage");
const video = document.getElementById("videoPreview");
const startScanBtn = document.getElementById("startScanBtn");
const textEl = document.getElementById("decodedText");
const copyBtn = document.getElementById("copyBtn");
const decodeCanvas = document.getElementById("decodeCanvas");

// --- Function to process frames ---
function scanFrame() {
  if (video.paused || video.ended) return;
  
  const ctx = decodeCanvas.getContext("2d");
  decodeCanvas.width = video.videoWidth;
  decodeCanvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, decodeCanvas.width, decodeCanvas.height);
  
  const imageData = ctx.getImageData(0, 0, decodeCanvas.width, decodeCanvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);

  if (code) {
    textEl.textContent = code.data;
    copyBtn.style.display = "block";
    stopCamera();
    // Vibrate phone if supported
    if (navigator.vibrate) navigator.vibrate(200);
  } else {
    requestAnimationFrame(scanFrame);
  }
}

function stopCamera() {
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.style.display = "none";
    startScanBtn.textContent = "📷 Scan with Camera";
  }
}

// --- Camera Toggle Logic ---
if (startScanBtn) {
  startScanBtn.addEventListener("click", async () => {
    if (video.style.display === "block") {
      stopCamera();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.style.display = "block";
        video.play();
        startScanBtn.textContent = "🛑 Stop Camera";
        textEl.textContent = "Scanning...";
        requestAnimationFrame(scanFrame);
      } catch (err) {
        alert("Camera access denied or not available.");
      }
    }
  });
}

// --- File Upload Decoder ---
if (qrImageInput) {
  qrImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        decodeCanvas.width = img.width;
        decodeCanvas.height = img.height;
        const ctx = decodeCanvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const code = jsQR(ctx.getImageData(0,0,img.width,img.height).data, img.width, img.height);
        textEl.textContent = code ? code.data : "No QR found";
        if (code) copyBtn.style.display = "block";
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// --- Copy Button Logic ---
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(textEl.textContent);
    const original = copyBtn.textContent;
    copyBtn.textContent = "✓ Copied!";
    setTimeout(() => copyBtn.textContent = original, 2000);
  });
}
