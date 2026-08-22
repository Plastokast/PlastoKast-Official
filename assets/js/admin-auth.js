document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Always Clear Login Credentials & Enforce Strict BFCache Security ---
  function clearCredentials() {
    const u = document.getElementById('username');
    const p = document.getElementById('password');
    const f = document.getElementById('login-form');
    if (f) f.reset();
    if (u) { u.value = ''; u.setAttribute('value', ''); }
    if (p) { p.value = ''; p.setAttribute('value', ''); }
  }

  function enforceSecurityCheck() {
    const loggedIn = sessionStorage.getItem('plastokast_admin_logged_in') === 'true';
    const isLoginPage = window.location.pathname.includes('admin-login.html');

    if (isLoginPage) {
      if (loggedIn) {
        window.location.replace('admin.html');
      } else {
        clearCredentials();
      }
    } else {
      if (!loggedIn) {
        window.location.replace('admin-login.html');
      }
    }
  }

  enforceSecurityCheck();

  window.addEventListener('pageshow', (event) => {
    enforceSecurityCheck();
  });
  setTimeout(clearCredentials, 50);
  setTimeout(clearCredentials, 250);

  // --- 1. Login Authentication Logic ---
  const loginForm = document.getElementById('login-form');
  const errorMsg = document.getElementById('error-msg');
  const btnTogglePass = document.getElementById('btnTogglePass');
  const passwordInput = document.getElementById('password');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('username').value.trim();
      const pass = passwordInput ? passwordInput.value : '';

      if (user === 'Plastokast_Admin' && pass === 'Plastokast@2026@&') {
        sessionStorage.setItem('plastokast_admin_logged_in', 'true');
        sessionStorage.setItem('plastokast_admin_role', 'Super Admin');
        window.location.replace('admin.html');
      } else {
        if (errorMsg) {
          errorMsg.style.display = 'flex';
          setTimeout(() => { errorMsg.style.display = 'none'; }, 4000);
        }
      }
    });
  }

  // Password Visibility Toggle
  if (btnTogglePass && passwordInput) {
    btnTogglePass.addEventListener('click', () => {
      const isPass = passwordInput.type === 'password';
      passwordInput.type = isPass ? 'text' : 'password';
      btnTogglePass.className = isPass ? 'fa fa-eye-slash toggle-pass' : 'fa fa-eye toggle-pass';
    });
  }

  // --- 2. Logout Handler ---
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('plastokast_admin_logged_in');
      sessionStorage.removeItem('plastokast_admin_role');
      sessionStorage.clear();
      window.location.replace('admin-login.html');
    });
  }

  // --- 3. Light Mode 3D DNA Canvas Animation ---
  const canvas = document.getElementById('dna-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvasContainer') || canvas.parentElement;

    let width = 0;
    let height = 0;
    let mouseX = 0;
    let targetMouseX = 0;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Mouse parallax tracking
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 0.4;
    });
    container.addEventListener('mouseleave', () => {
      targetMouseX = 0;
    });

    // Ambient floating particles
    const particles = [];
    const numParticles = 30;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 1,
        vy: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    let angle = 0;
    
    function renderFrame() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;

      // 1. Draw Tech Grid Background (Light Slate)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.06)';
      const gridSpacing = 40;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Floating Dust Particles (Medical Blue)
      particles.forEach(p => {
        p.y -= p.vy;
        if (p.y < 0) p.y = height;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha * 0.35})`;
        ctx.fill();
      });

      // 3. Draw 3D Double Helix
      const numNodes = 24;
      const spacing = height / (numNodes + 1);
      const amplitude = width * 0.22;
      const centerX = width / 2 + mouseX * width;

      const strand1Points = [];
      const strand2Points = [];

      for (let i = 0; i < numNodes; i++) {
        const y = spacing * (i + 1);
        
        const phase1 = angle + (i * 0.35);
        const phase2 = phase1 + Math.PI;

        const x1 = centerX + Math.sin(phase1) * amplitude;
        const x2 = centerX + Math.sin(phase2) * amplitude;

        const z1 = Math.cos(phase1);
        const z2 = Math.cos(phase2);

        strand1Points.push({ x: x1, y: y, z: z1 });
        strand2Points.push({ x: x2, y: y, z: z2 });

        // Draw Connecting Rung
        const grad = ctx.createLinearGradient(x1, y, x2, y);
        grad.addColorStop(0, `rgba(2, 132, 199, ${0.25 + (z1 + 1) * 0.25})`);
        grad.addColorStop(0.5, `rgba(37, 99, 235, ${0.35 + (z1 + z2 + 2) * 0.2})`);
        grad.addColorStop(1, `rgba(14, 165, 233, ${0.25 + (z2 + 1) * 0.25})`);

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // Draw Backbone Curves
      ctx.lineWidth = 2.5;
      
      // Backbone 1 (Cyan)
      ctx.beginPath();
      for (let i = 0; i < strand1Points.length - 1; i++) {
        const p1 = strand1Points[i];
        const p2 = strand1Points[i + 1];
        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;
        if (i === 0) ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      }
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.55)';
      ctx.stroke();

      // Backbone 2 (Medical Blue)
      ctx.beginPath();
      for (let i = 0; i < strand2Points.length - 1; i++) {
        const p1 = strand2Points[i];
        const p2 = strand2Points[i + 1];
        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;
        if (i === 0) ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      }
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.55)';
      ctx.stroke();

      // Draw Glowing Sphere Nodes
      for (let i = 0; i < numNodes; i++) {
        const p1 = strand1Points[i];
        const p2 = strand2Points[i];

        // Node 1 (Cyan)
        const r1 = 3.5 + (p1.z + 1) * 2.5;
        const alpha1 = 0.5 + (p1.z + 1) * 0.25;
        
        ctx.save();
        ctx.shadowBlur = p1.z > 0 ? 10 : 0;
        ctx.shadowColor = '#0284c7';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, r1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(2, 132, 199, ${alpha1})`;
        ctx.fill();
        ctx.restore();

        // Node 2 (Medical Blue)
        const r2 = 3.5 + (p2.z + 1) * 2.5;
        const alpha2 = 0.5 + (p2.z + 1) * 0.25;

        ctx.save();
        ctx.shadowBlur = p2.z > 0 ? 10 : 0;
        ctx.shadowColor = '#2563eb';
        ctx.beginPath();
        ctx.arc(p2.x, p2.y, r2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${alpha2})`;
        ctx.fill();
        ctx.restore();
      }

      angle -= 0.018; // Smooth rotation
      requestAnimationFrame(renderFrame);
    }
    
    renderFrame();
  }
});
