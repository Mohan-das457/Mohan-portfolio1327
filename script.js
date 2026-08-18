// =========================================================
// B. MOHAN — PORTFOLIO V2.0 SCRIPT ENGINE
// Three.js 3D Holographic Engine with Gravitational Mouse Field,
// Undulating Quantum Grid, Multi-Theme Modes, 3D Parallax Tilt,
// Web Audio Synth, Skill Gauges & Interactive Modals.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. WEB AUDIO SYNTHESIZER (UI SOUND FX)
    // ---------------------------------------------------------
    let soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    const soundToggleBtn = document.getElementById('sound-toggle');
    const soundStatusEl = soundToggleBtn ? soundToggleBtn.querySelector('.sound-status') : null;

    function updateSoundUI() {
        if (soundStatusEl) {
            soundStatusEl.textContent = soundEnabled ? 'FX ON' : 'FX OFF';
            soundToggleBtn.style.borderColor = soundEnabled ? 'var(--cyan)' : 'var(--border-glass)';
        }
    }
    updateSoundUI();

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('sound_enabled', soundEnabled);
            updateSoundUI();
            if (soundEnabled) playSynthSound(800, 'sine', 0.08);
        });
    }

    function playSynthSound(freq = 440, type = 'sine', duration = 0.05) {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Fallback for audio policy
        }
    }

    // Attach sound feedback
    document.querySelectorAll('a, button, .filter-btn, .tilt-card').forEach(el => {
        el.addEventListener('mouseenter', () => playSynthSound(520, 'sine', 0.03));
        el.addEventListener('click', () => playSynthSound(780, 'triangle', 0.06));
    });

    // ---------------------------------------------------------
    // 2. ULTRA-UNIQUE THREE.js 3D MULTI-THEME ENGINE
    // ---------------------------------------------------------
    const canvas = document.getElementById('three-canvas');
    let currentThemeIdx = 0;
    const themes = [
        { name: '3D: CYBER', primaryColor: 0x00f0ff, secondaryColor: 0x8a2be2, bgColor: 0x060911, fogDensity: 0.015 },
        { name: '3D: NEBULA', primaryColor: 0xffd700, secondaryColor: 0x00ff9d, bgColor: 0x0a0714, fogDensity: 0.012 },
        { name: '3D: MATRIX', primaryColor: 0x00ff66, secondaryColor: 0x00ffff, bgColor: 0x020f08, fogDensity: 0.018 },
        { name: '3D: WARP', primaryColor: 0xff007f, secondaryColor: 0x7000ff, bgColor: 0x090514, fogDensity: 0.01 }
    ];

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeNameEl = document.getElementById('theme-name');

    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(themes[0].bgColor, themes[0].fogDensity);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 24);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- Layer 1: Undulating Quantum Grid Floor ---
        const gridGeo = new THREE.PlaneGeometry(120, 120, 40, 40);
        const gridMat = new THREE.MeshBasicMaterial({
            color: themes[0].primaryColor,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const gridMesh = new THREE.Mesh(gridGeo, gridMat);
        gridMesh.rotation.x = -Math.PI / 2;
        gridMesh.position.y = -12;
        scene.add(gridMesh);

        // --- Layer 2: Holographic Core Geometry ---
        const icoGeo = new THREE.IcosahedronGeometry(6.5, 2);
        const icoMat = new THREE.MeshBasicMaterial({
            color: themes[0].primaryColor,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const coreMesh = new THREE.Mesh(icoGeo, icoMat);
        scene.add(coreMesh);

        // Torus Ring 1
        const torusGeo1 = new THREE.TorusGeometry(9.5, 0.08, 16, 100);
        const torusMat1 = new THREE.MeshBasicMaterial({ color: themes[0].secondaryColor, wireframe: true, transparent: true, opacity: 0.4 });
        const ring1 = new THREE.Mesh(torusGeo1, torusMat1);
        ring1.rotation.x = Math.PI / 3;
        scene.add(ring1);

        // Torus Ring 2
        const torusGeo2 = new THREE.TorusGeometry(12.5, 0.05, 16, 100);
        const torusMat2 = new THREE.MeshBasicMaterial({ color: themes[0].primaryColor, wireframe: true, transparent: true, opacity: 0.25 });
        const ring2 = new THREE.Mesh(torusGeo2, torusMat2);
        ring2.rotation.y = Math.PI / 4;
        scene.add(ring2);

        // --- Layer 3: Gravitational Particle Field (1,500 Nodes) ---
        const particleCount = 1500;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const originalPositions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const px = (Math.random() - 0.5) * 90;
            const py = (Math.random() - 0.5) * 90;
            const pz = (Math.random() - 0.5) * 90;
            
            positions[i] = px;
            positions[i + 1] = py;
            positions[i + 2] = pz;

            originalPositions[i] = px;
            originalPositions[i + 1] = py;
            originalPositions[i + 2] = pz;

            velocities[i] = (Math.random() - 0.5) * 0.02;
            velocities[i + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i + 2] = (Math.random() - 0.5) * 0.02;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.2,
            color: themes[0].primaryColor,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // Mouse Gravitational Tracking
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        let mouseWorldPos = new THREE.Vector3(0, 0, 0);

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
            
            mouseWorldPos.x = (e.clientX / window.innerWidth) * 30 - 15;
            mouseWorldPos.y = -(e.clientY / window.innerHeight) * 30 + 15;
        });

        let scrollY = 0;
        window.addEventListener('scroll', () => { scrollY = window.scrollY; });

        // Theme Switcher Functionality
        function applyTheme(themeIdx) {
            const theme = themes[themeIdx];
            if (themeNameEl) themeNameEl.textContent = theme.name;

            // Lerp or set material colors
            icoMat.color.setHex(theme.primaryColor);
            gridMat.color.setHex(theme.primaryColor);
            torusMat1.color.setHex(theme.secondaryColor);
            torusMat2.color.setHex(theme.primaryColor);
            particleMat.color.setHex(theme.primaryColor);
            scene.fog.color.setHex(theme.bgColor);

            playSynthSound(950, 'triangle', 0.1);
        }

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                currentThemeIdx = (currentThemeIdx + 1) % themes.length;
                applyTheme(currentThemeIdx);
                showToast(`🎨 3D Mode Switched: ${themes[currentThemeIdx].name}`);
            });
        }

        // FPS Calculation & Animation Loop
        let lastFrameTime = performance.now();
        let frameCount = 0;
        const fpsCounterEl = document.getElementById('fps-counter');

        function animate(time) {
            requestAnimationFrame(animate);

            // FPS Counter
            frameCount++;
            if (time - lastFrameTime >= 1000) {
                if (fpsCounterEl) fpsCounterEl.textContent = Math.round((frameCount * 1000) / (time - lastFrameTime));
                frameCount = 0;
                lastFrameTime = time;
            }

            // Smooth Lerp for Mouse Camera Parallax
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            // Core Geometry Rotations
            const speedMult = currentThemeIdx === 3 ? 2.5 : 1.0; // Faster in Warp mode
            coreMesh.rotation.x += 0.003 * speedMult;
            coreMesh.rotation.y += 0.005 * speedMult;

            ring1.rotation.x += 0.004 * speedMult;
            ring1.rotation.z += 0.002 * speedMult;

            ring2.rotation.y -= 0.003 * speedMult;
            ring2.rotation.z -= 0.004 * speedMult;

            // Undulating 3D Grid Wave
            const gridPositions = gridGeo.attributes.position.array;
            for (let i = 0; i < gridPositions.length; i += 3) {
                const vx = gridPositions[i];
                const vy = gridPositions[i + 1];
                gridPositions[i + 2] = Math.sin(vx * 0.2 + time * 0.002) * Math.cos(vy * 0.2 + time * 0.002) * 1.5;
            }
            gridGeo.attributes.position.needsUpdate = true;

            // Particle Swarm Gravitational Physics
            const posArr = particleGeo.attributes.position.array;
            for (let i = 0; i < particleCount * 3; i += 3) {
                posArr[i] += velocities[i];
                posArr[i + 1] += velocities[i + 1];
                posArr[i + 2] += velocities[i + 2];

                // Gravitational pull toward mouse position when close
                const dx = mouseWorldPos.x - posArr[i];
                const dy = mouseWorldPos.y - posArr[i + 1];
                const distSq = dx * dx + dy * dy;

                if (distSq < 100) {
                    posArr[i] += dx * 0.002;
                    posArr[i + 1] += dy * 0.002;
                }

                // Boundary Wrap
                if (Math.abs(posArr[i]) > 45) posArr[i] = -posArr[i];
                if (Math.abs(posArr[i + 1]) > 45) posArr[i + 1] = -posArr[i + 1];
                if (Math.abs(posArr[i + 2]) > 45) posArr[i + 2] = -posArr[i + 2];
            }
            particleGeo.attributes.position.needsUpdate = true;

            // Parallax Scene Rotation
            scene.rotation.y = targetX * 1.8;
            scene.rotation.x = targetY * 1.8;

            // Camera Scroll Dynamics
            camera.position.y = 2 - scrollY * 0.005;
            camera.position.z = 24 + Math.sin(scrollY * 0.001) * 2.5;

            renderer.render(scene, camera);
        }
        animate(performance.now());

        // Resize Listener
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ---------------------------------------------------------
    // 3. 3D CARD PARALLAX TILT EFFECT
    // ---------------------------------------------------------
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // ---------------------------------------------------------
    // 4. RETICLE CURSOR TRACKING
    // ---------------------------------------------------------
    const reticle = document.getElementById('reticle');
    if (reticle && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            reticle.style.left = e.clientX + 'px';
            reticle.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, input, textarea, .tilt-card').forEach(el => {
            el.addEventListener('mouseenter', () => reticle.classList.add('active'));
            el.addEventListener('mouseleave', () => reticle.classList.remove('active'));
        });
    }

    // ---------------------------------------------------------
    // 5. HERO TYPEWRITER EFFECT
    // ---------------------------------------------------------
    const typewriterEl = document.getElementById('typewriter-text');
    if (typewriterEl) {
        const roles = [
            'Computer Science & Technology Student',
            'Full-Stack Web Developer',
            'Systems & UI/UX Architect',
            'Lead Dev — Invicta 2K26 (MITS Tech Fest)',
            'Algorithmic Problem Solver'
        ];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentRole = roles[roleIdx];
            if (isDeleting) {
                typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIdx === currentRole.length) {
                typeSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }
        typeLoop();
    }

    // ---------------------------------------------------------
    // 6. LIVE MADANAPALLE IST CLOCK
    // ---------------------------------------------------------
    const clockEl = document.getElementById('live-ist-clock');
    function updateISTClock() {
        if (!clockEl) return;
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
    updateISTClock();
    setInterval(updateISTClock, 1000);

    // ---------------------------------------------------------
    // 7. COUNTER & SKILL GAUGE INTERSECTION OBSERVERS
    // ---------------------------------------------------------
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target, 10);
                let current = 0;
                const step = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        entry.target.textContent = target;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = current;
                    }
                }, 30);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    const gaugeFills = document.querySelectorAll('.gauge-fill');
    const gaugeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.dataset.level;
                entry.target.style.width = level + '%';
            }
        });
    }, { threshold: 0.3 });
    gaugeFills.forEach(g => gaugeObserver.observe(g));

    // ---------------------------------------------------------
    // 8. PROJECT FILTERING LOGIC
    // ---------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const categories = card.dataset.category || '';
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });

    // ---------------------------------------------------------
    // 9. PROJECT DETAILS MODAL POPUP
    // ---------------------------------------------------------
    const projModal = document.getElementById('project-modal');
    const projModalBody = document.getElementById('proj-modal-body');
    const projModalClose = document.getElementById('proj-modal-close');

    const projectData = {
        invicta: {
            title: 'Invicta 2K26 — National Tech Fest Portal',
            badge: 'MITS Tech Fest Lead Project',
            desc: 'Complete web ecosystem engineered for MITS College flagship technical fest. Handles online participant registration, real-time schedule feeds, event venue maps, live leaderboards, and coordinator contact trees.',
            tech: ['HTML5', 'CSS Blueprint', 'JavaScript ES6', 'Canvas API', 'Web Audio'],
            github: 'https://github.com/Mohan-das457/invicta-2k26'
        },
        nearkart: {
            title: 'NearKart — Hyperlocal Commerce Aggregator',
            badge: 'Local Retail Solution',
            desc: 'A full-stack hyperlocal commerce web app enabling Kirana & retail stores in Madanapalle to post live product inventories and connect directly with nearby buyers for quick home fulfillment.',
            tech: ['JavaScript ES6', 'CSS3 Grid', 'RESTful API Specs', 'LocalStorage'],
            github: 'https://github.com/Mohan-das457/nearkart'
        },
        attendance: {
            title: 'Smart College Attendance System',
            badge: 'Academic Research & Dev',
            desc: 'Automated attendance tracking platform designed for MITS faculty to monitor lab & lecture attendance, compute percentage shortages, and auto-flag low attendance students.',
            tech: ['Vite / React', 'Node.js', 'Express', 'MongoDB'],
            github: '#'
        },
        graphics: {
            title: 'Cyber 3D Particle Mesh Engine',
            badge: 'WebGL & Three.js',
            desc: 'Custom-coded 3D particle constellation and wireframe geometry renderer running on Three.js WebGL shaders with interactive mouse forces and audio sync.',
            tech: ['Three.js', 'WebGL', 'GLSL', 'Web Audio Synth'],
            github: '#'
        }
    };

    document.querySelectorAll('.btn-detail-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.project;
            const data = projectData[key];
            if (data && projModal && projModalBody) {
                projModalBody.innerHTML = `
                    <span class="card-mono-tag">${data.badge}</span>
                    <h2 style="font-size:1.8rem; margin:10px 0;">${data.title}</h2>
                    <p style="color:var(--text-secondary); margin-bottom:20px; line-height:1.6;">${data.desc}</p>
                    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
                        ${data.tech.map(t => `<span style="font-family:var(--font-mono); font-size:0.7rem; padding:4px 10px; background:rgba(0,240,255,0.1); color:var(--cyan); border-radius:4px;">${t}</span>`).join('')}
                    </div>
                    ${data.github !== '#' ? `<a href="${data.github}" target="_blank" class="btn-primary" style="display:inline-flex;">VIEW GITHUB REPOSITORY →</a>` : ''}
                `;
                projModal.classList.add('active');
            }
        });
    });

    if (projModalClose) {
        projModalClose.addEventListener('click', () => projModal.classList.remove('active'));
    }
    if (projModal) {
        projModal.addEventListener('click', (e) => {
            if (e.target === projModal) projModal.classList.remove('active');
        });
    }

    // ---------------------------------------------------------
    // 10. INTERACTIVE TERMINAL CLI (`Ctrl + K` or Button)
    // ---------------------------------------------------------
    const termModal = document.getElementById('terminal-modal');
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');
    const cmdBtns = [document.getElementById('cmd-btn'), document.getElementById('hero-cmd-btn')];
    const termCloseBtns = [document.getElementById('term-close-btn'), document.getElementById('term-x-close')];

    function openTerminal() {
        if (termModal) {
            termModal.classList.add('active');
            if (termInput) termInput.focus();
            playSynthSound(900, 'sine', 0.1);
        }
    }

    function closeTerminal() {
        if (termModal) termModal.classList.remove('active');
    }

    cmdBtns.forEach(btn => { if (btn) btn.addEventListener('click', openTerminal); });
    termCloseBtns.forEach(btn => { if (btn) btn.addEventListener('click', closeTerminal); });

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (termModal.classList.contains('active')) closeTerminal();
            else openTerminal();
        } else if (e.key === 'Escape' && termModal && termModal.classList.contains('active')) {
            closeTerminal();
        }
    });

    const commands = {
        help: `
Available CLI Commands:
  • <span class="term-cmd-highlight">about</span>      - View Mohan's bio & background
  • <span class="term-cmd-highlight">skills</span>     - Display tech stack specifications
  • <span class="term-cmd-highlight">projects</span>   - List featured builds & repositories
  • <span class="term-cmd-highlight">mits</span>       - Show college & academic profile
  • <span class="term-cmd-highlight">contact</span>    - Show correspondence details
  • <span class="term-cmd-highlight">time</span>       - Get live Madanapalle IST local time
  • <span class="term-cmd-highlight">theme</span>      - Switch 3D background theme mode
  • <span class="term-cmd-highlight">clear</span>      - Clear terminal logs
        `,
        about: `B. MOHAN — Computer Science & Technology student @ MITS Madanapalle. Dedicated to building high-performance web systems, clean algorithms, and immersive interactive software.`,
        skills: `TECH STACK: JavaScript (ES6+), Three.js/WebGL, React/Vite, HTML5/CSS3, Java, C/C++, Data Structures, Node.js, Git, Linux CLI.`,
        projects: `FEATURED BUILDS:\n1. Invicta 2K26 (MITS Tech Fest Web Platform)\n2. NearKart (Hyperlocal Shop Connector)\n3. Smart Attendance Tracking App\n4. Cyber 3D Particle Mesh Generator`,
        mits: `Madanapalle Institute of Technology & Science (MITS)\nDept: Computer Science & Technology\nLocation: Madanapalle, Andhra Pradesh, India`,
        contact: `Email: your.email@example.com | GitHub: github.com/Mohan-das457 | Location: Madanapalle, India`,
        time: () => `CURRENT IST TIME: ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
        theme: () => {
            currentThemeIdx = (currentThemeIdx + 1) % themes.length;
            if (themeToggleBtn) themeToggleBtn.click();
            return `3D Theme changed to: ${themes[currentThemeIdx].name}`;
        }
    };

    if (termInput && termOutput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmdText = termInput.value.trim().toLowerCase();
                termInput.value = '';
                if (!cmdText) return;

                const inputRow = document.createElement('div');
                inputRow.className = 'term-out-line';
                inputRow.innerHTML = `<span class="term-prompt">mohan@mits:~$</span> <span class="term-out-cmd">${cmdText}</span>`;
                termOutput.appendChild(inputRow);

                if (cmdText === 'clear') {
                    termOutput.innerHTML = '';
                } else if (commands[cmdText]) {
                    const response = typeof commands[cmdText] === 'function' ? commands[cmdText]() : commands[cmdText];
                    const resRow = document.createElement('div');
                    resRow.className = 'term-out-line';
                    resRow.innerHTML = `<pre style="font-family:inherit; white-space:pre-wrap; color:#94a3b8;">${response}</pre>`;
                    termOutput.appendChild(resRow);
                } else {
                    const errRow = document.createElement('div');
                    errRow.className = 'term-out-line';
                    errRow.innerHTML = `<span style="color:#ef4444;">Command not found: '${cmdText}'. Type 'help' for options.</span>`;
                    termOutput.appendChild(errRow);
                }

                termOutput.scrollTop = termOutput.scrollHeight;
                playSynthSound(600, 'sine', 0.04);
            }
        });
    }

    // ---------------------------------------------------------
    // 11. NAVBAR & HUD SCROLL OBSERVER
    // ---------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const hudActiveSec = document.getElementById('hud-active-section');
    const hudScrollFill = document.getElementById('hud-scroll-fill');

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);

        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (hudScrollFill && totalScroll > 0) {
            const pct = (window.scrollY / totalScroll) * 100;
            hudScrollFill.style.width = pct + '%';
        }

        let currentSec = '01 // HOME';
        sections.forEach(sec => {
            const top = sec.offsetTop - 150;
            if (window.scrollY >= top) {
                const id = sec.id.toUpperCase();
                currentSec = `0${Array.from(sections).indexOf(sec) + 1} // ${id}`;
            }
        });
        if (hudActiveSec) hudActiveSec.textContent = currentSec;
    });

    // Mobile Navigation Burger Toggle
    const burger = document.getElementById('burger');
    const navLinks = document.querySelector('.nav-links');
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // ---------------------------------------------------------
    // 12. CONTACT FORM & TOAST NOTIFICATIONS
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    function showToast(msg) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        toastContainer.appendChild(toast);
        playSynthSound(880, 'sine', 0.12);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('✓ MESSAGE TRANSMITTED TO B. MOHAN SUCCESSFULLY!');
            contactForm.reset();
        });
    }

    // Demo 3D Canvas button in projects
    const demo3dBtn = document.getElementById('view-3d-demo-btn');
    if (demo3dBtn) {
        demo3dBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (themeToggleBtn) themeToggleBtn.click();
        });
    }
});
