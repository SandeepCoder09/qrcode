/**
 * 09 QR Studio — Complete Logic (v4.0)
 * SVG icons, B&W theme, fixed spacing & camera scanning
 */

/* ================================================================
   SVG ICON LIBRARY
   Usage: icon('name') → HTML string with inline <svg>
================================================================ */
const ICONS = {
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2"  x2="12" y2="4"/>
    <line x1="12" y1="20" x2="12" y2="22"/>
    <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="2"  y1="12" x2="4"  y2="12"/>
    <line x1="20" y1="12" x2="22" y2="12"/>
    <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
  </svg>`,

  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`,

  generate: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>`,

  download: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>`,

  copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`,

  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,

  camera: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>`,

  stop: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
  </svg>`,

  arrowLeft: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>`,

  arrowRight: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>`,
};

/** Wraps an SVG icon in a .btn-icon span */
function icon(name) {
  return `<span class="btn-icon" aria-hidden="true">${ICONS[name] || ''}</span>`;
}

/** Sets button inner HTML = icon + label text */
function setBtn(el, iconName, label) {
  if (!el) return;
  el.innerHTML = `${icon(iconName)}<span>${label}</span>`;
}

/* ================================================================
   1. THEME TOGGLE
================================================================ */
(function initTheme() {
  const themeBtn = document.getElementById("themeToggle");
  if (!themeBtn) return;

  const saved = localStorage.getItem("qr-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  // Icon is purely CSS (mask-image), button text stays empty
  themeBtn.setAttribute("aria-label", saved === "dark" ? "Switch to light theme" : "Switch to dark theme");

  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("qr-theme", next);
    themeBtn.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
  });
})();

/* ================================================================
   2. QR GENERATOR
================================================================ */
(function initGenerator() {
  const generateBtn = document.getElementById("generateBtn");
  if (!generateBtn) return;

  // Set SVG icons on static buttons
  setBtn(generateBtn, "generate", "Generate QR");
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) setBtn(downloadBtn, "download", "Download QR");
  const switchLink = document.querySelector(".switch-page");
  if (switchLink) switchLink.innerHTML = `${icon("arrowRight")}<span>Go to Decoder</span>`;

  // Logo input file name display
  const logoInput = document.getElementById("logoInput");
  const fileLabel = logoInput?.closest(".file-label");
  if (logoInput && fileLabel) {
    logoInput.addEventListener("change", () => {
      const file = logoInput.files[0];
      const span = fileLabel.querySelector("span");
      if (span) {
        span.textContent = file ? file.name : "Upload Logo (Optional)";
        fileLabel.classList.toggle("has-file", !!file);
      }
    });
  }

  generateBtn.addEventListener("click", () => {
    const text      = document.getElementById("qrText")?.value.trim();
    const logoFile  = logoInput?.files[0];
    const output    = document.getElementById("qrOutput");
    const spinner   = document.getElementById("loadingSpinner");

    if (!text) {
      document.getElementById("qrText")?.focus();
      return;
    }

    // Reset output area
    output.innerHTML = "";
    if (downloadBtn) {
      downloadBtn.style.display = "none";
      downloadBtn.removeAttribute("href");
    }
    if (spinner) spinner.classList.add("active");

    if (typeof QRCode === "undefined") {
      if (spinner) spinner.classList.remove("active");
      alert("QR library failed to load. Please refresh the page.");
      return;
    }

    QRCode.toCanvas(text, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: "H"
    }, (err, canvas) => {
      if (spinner) spinner.classList.remove("active");
      if (err) { console.error(err); return; }

      const ctx  = canvas.getContext("2d");
      const size = canvas.width * 0.22;
      const x    = (canvas.width - size) / 2;
      const y    = (canvas.height - size) / 2;

      // White badge for logo area
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - 8, y - 8, size + 16, size + 16, 20);
      else               ctx.fillRect(x - 8, y - 8, size + 16, size + 16);
      ctx.fill();

      const finalizeUI = () => {
        output.innerHTML = "";
        output.appendChild(canvas);
        if (downloadBtn) {
          downloadBtn.style.display = "flex";
          downloadBtn.href = canvas.toDataURL("image/png");
        }
      };

      if (logoFile) {
        const reader = new FileReader();
        const logo   = new Image();
        reader.onload = () => {
          logo.onload = () => { ctx.drawImage(logo, x, y, size, size); finalizeUI(); };
          logo.src = reader.result;
        };
        reader.readAsDataURL(logoFile);
      } else {
        // Default "09" brand mark (black on white)
        ctx.fillStyle = "#111111";
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.floor(size * 0.44)}px 'Poppins', sans-serif`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("09", x + size / 2, y + size / 2 + 2);
        finalizeUI();
      }
    });
  });
})();

/* ================================================================
   3. QR DECODER — FILE & LIVE CAMERA
================================================================ */
(function initDecoder() {
  const qrImageInput = document.getElementById("qrImage");
  const startScanBtn = document.getElementById("startScanBtn");
  const textEl       = document.getElementById("decodedText");
  const copyBtn      = document.getElementById("copyBtn");
  const decodeCanvas = document.getElementById("decodeCanvas");
  const decodedBox   = document.querySelector(".decoded-box");
  const spinner      = document.getElementById("decodeSpinner");

  if (!qrImageInput && !startScanBtn) return;

  // Set SVG icons on static buttons
  if (copyBtn)      setBtn(copyBtn,      "copy",   "Copy Text");
  if (startScanBtn) setBtn(startScanBtn, "camera", "Scan with Camera");
  const switchLink  = document.querySelector(".switch-page");
  if (switchLink)   switchLink.innerHTML = `${icon("arrowLeft")}<span>Back to Generator</span>`;

  const jsQRReady = () => typeof jsQR !== "undefined";

  /* ---- Build camera UI ---- */
  let cameraWrapper = document.querySelector(".camera-wrapper");
  let video         = document.getElementById("videoPreview");
  let scanBadge     = document.querySelector(".scan-badge");

  if (!cameraWrapper && startScanBtn) {
    cameraWrapper = document.createElement("div");
    cameraWrapper.className = "camera-wrapper";

    video = document.createElement("video");
    video.id          = "videoPreview";
    video.playsInline = true;
    video.autoplay    = true;
    video.muted       = true;

    const scanLine  = document.createElement("div");
    scanLine.className = "scan-line";

    const corners   = document.createElement("div");
    corners.className = "scan-corners";

    cameraWrapper.appendChild(video);
    cameraWrapper.appendChild(scanLine);
    cameraWrapper.appendChild(corners);
    startScanBtn.parentNode.insertBefore(cameraWrapper, startScanBtn);

    scanBadge = document.createElement("div");
    scanBadge.className = "scan-badge";
    scanBadge.innerHTML = '<span class="dot"></span><span>Scanning for QR code…</span>';
    startScanBtn.parentNode.insertBefore(scanBadge, startScanBtn);
  }

  let animFrameId  = null;
  let cameraActive = false;
  let stream       = null;

  /* ---- Helpers ---- */
  function setResult(text, isSuccess = false) {
    if (!textEl) return;
    textEl.textContent = text;
    if (decodedBox) decodedBox.classList.toggle("success", isSuccess);
    if (copyBtn) copyBtn.style.display = isSuccess ? "flex" : "none";
  }

  function showSpinner(show) {
    if (spinner) spinner.classList.toggle("active", show);
  }

  /* ---- Frame scanner ---- */
  function scanFrame() {
    if (!video || !decodeCanvas || video.readyState < 2) {
      animFrameId = requestAnimationFrame(scanFrame);
      return;
    }
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) { animFrameId = requestAnimationFrame(scanFrame); return; }

    decodeCanvas.width  = vw;
    decodeCanvas.height = vh;
    const ctx = decodeCanvas.getContext("2d");
    ctx.drawImage(video, 0, 0, vw, vh);

    if (!jsQRReady()) { animFrameId = requestAnimationFrame(scanFrame); return; }

    const imageData = ctx.getImageData(0, 0, vw, vh);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });

    if (code?.data) {
      stopCamera();
      setResult(code.data, true);
      if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    } else {
      animFrameId = requestAnimationFrame(scanFrame);
    }
  }

  /* ---- Stop camera ---- */
  function stopCamera() {
    cameraActive = false;
    if (animFrameId)   { cancelAnimationFrame(animFrameId); animFrameId = null; }
    if (stream)        { stream.getTracks().forEach(t => t.stop()); stream = null; }
    if (video)         { video.srcObject = null; }
    if (cameraWrapper) cameraWrapper.classList.remove("active");
    if (scanBadge)     scanBadge.classList.remove("active");
    if (startScanBtn)  setBtn(startScanBtn, "camera", "Scan with Camera");
  }

  /* ---- Start camera ---- */
  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera not supported on this browser.");
      return;
    }
    if (!jsQRReady()) {
      alert("QR scanner library failed to load. Please refresh.");
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      video.srcObject = stream;
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => video.play().then(resolve).catch(reject);
        video.onerror = reject;
      });
      cameraWrapper.classList.add("active");
      scanBadge.classList.add("active");
      setBtn(startScanBtn, "stop", "Stop Camera");
      cameraActive = true;
      setResult("Scanning… point camera at a QR code.", false);
      animFrameId = requestAnimationFrame(scanFrame);
    } catch (err) {
      let msg = "Camera access denied.";
      if (err.name === "NotFoundError")        msg = "No camera found on this device.";
      if (err.name === "NotAllowedError")      msg = "Camera permission denied. Please allow and retry.";
      if (err.name === "NotReadableError")     msg = "Camera is in use by another app.";
      if (err.name === "OverconstrainedError") msg = "No suitable camera found.";
      alert(msg);
      stopCamera();
    }
  }

  /* ---- Camera toggle ---- */
  if (startScanBtn) {
    startScanBtn.addEventListener("click", () => {
      if (cameraActive) { stopCamera(); setResult("Upload a QR image or scan with camera…", false); }
      else              { startCamera(); }
    });
  }

  /* ---- File decoder ---- */
  if (qrImageInput) {
    const fileLabel = qrImageInput.closest(".file-label");
    const fileSpan  = fileLabel?.querySelector("span");

    qrImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (fileSpan) fileSpan.textContent = file.name;
      if (fileLabel) fileLabel.classList.add("has-file");

      stopCamera();
      showSpinner(true);
      setResult("Decoding…", false);

      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          decodeCanvas.width  = img.width;
          decodeCanvas.height = img.height;
          const ctx = decodeCanvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          showSpinner(false);
          if (!jsQRReady()) { setResult("QR library not loaded. Refresh the page.", false); return; }
          const data = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(data.data, data.width, data.height, { inversionAttempts: "attemptBoth" });
          setResult(code ? code.data : "No QR code found in this image.", !!code);
        };
        img.onerror = () => { showSpinner(false); setResult("Failed to load image.", false); };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---- Copy button ---- */
  if (copyBtn) {
    copyBtn.style.display = "none";
    copyBtn.addEventListener("click", async () => {
      const txt = textEl?.textContent || "";
      if (!txt) return;
      try {
        await navigator.clipboard.writeText(txt);
      } catch {
        const ta = Object.assign(document.createElement("textarea"), {
          value: txt,
          style: "position:fixed;opacity:0"
        });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setBtn(copyBtn, "check", "Copied!");
      setTimeout(() => setBtn(copyBtn, "copy", "Copy Text"), 2000);
    });
  }
})();
