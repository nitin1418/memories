document.addEventListener('DOMContentLoaded', () => {
    // Background Particles
    const particlesContainer = document.getElementById('particles');
    const particleTypes = ['💜', '✨', '💙', '💫', '🦋'];

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Randomize
        particle.textContent = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.fontSize = `${Math.random() * 10 + 10}px`;
        particle.style.animationDuration = `${Math.random() * 8 + 8}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 15000);
    }

    // Initial particles
    for (let i = 0; i < 20; i++) {
        setTimeout(createParticle, Math.random() * 5000);
    }

    setInterval(createParticle, 800);

    // Gatekeeper Password Logic
    const gatekeeper = document.getElementById('gatekeeper');
    const mainContent = document.getElementById('main-content');
    const bdayInput = document.getElementById('bday-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const bdayError = document.getElementById('bday-error');

    // To ensure enter key works
    bdayInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') unlockBtn.click();
    });

    unlockBtn.addEventListener('click', () => {
        const val = bdayInput.value.trim().toLowerCase();
        if (['maadu'].includes(val)) {
            gatekeeper.style.display = 'none';
            mainContent.style.display = 'block';

            // Recalculate path drawing correctly now that it's visible
            setTimeout(drawPath, 100);
            setTimeout(drawPath, 500);

            // Create nice success particle explosion
            for (let i = 0; i < 15; i++) {
                setTimeout(createParticle, i * 100);
            }

            if (!isPlaying) {
                toggleMusic();
            }
        } else {
            bdayError.style.display = 'block';
            bdayInput.style.borderColor = '#e74c3c';

            // Invalid shake animation
            gatekeeper.querySelector('.gatekeeper-card').animate([
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(0)' }
            ], { duration: 400, easing: 'ease-in-out' });

            bdayInput.value = '';
            setTimeout(() => { bdayInput.style.borderColor = 'rgba(107, 76, 154, 0.3)'; }, 2000);
        }
    });

    // Audio Control
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    let isPlaying = false;

    function toggleMusic() {
        if (isPlaying) {
            bgMusic.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            bgMusic.play().catch(err => console.log('Audio autoplay prevented:', err));
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
        isPlaying = !isPlaying;
    }

    musicToggle.addEventListener('click', toggleMusic);



    // Intersection Observer
    const memoryPoints = document.querySelectorAll('.memory-point');
    memoryPoints.forEach(point => point.classList.add('inactive'));

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1
    };

    const memoryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.remove('inactive');
            } else {
                entry.target.classList.remove('active');
                entry.target.classList.add('inactive');
            }
        });
    }, observerOptions);

    memoryPoints.forEach(point => memoryObserver.observe(point));

    // Interactive cursor clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('.memory-card') || e.target.closest('.gatekeeper-card') || e.target.closest('.gift-box')) return;
        createClickEffect(e);
    });

    function createClickEffect(e) {
        const heart = document.createElement('div');
        const emojis = ['💙', '💜', '✨', '🦋'];
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.position = 'fixed';
        heart.style.left = `${e.clientX - 10}px`;
        heart.style.top = `${e.clientY - 10}px`;
        heart.style.pointerEvents = 'none';
        heart.style.fontSize = '20px';
        heart.style.transition = 'all 1s ease-out';
        heart.style.zIndex = '9999';

        document.body.appendChild(heart);

        // Trigger reflow
        heart.getBoundingClientRect();

        heart.style.transform = `translateY(-50px) scale(1.5)`;
        heart.style.opacity = '0';

        setTimeout(() => {
            heart.remove();
        }, 1000);
    }

    // Dodging Surprise Gift Box Logic (Moves randomly for 5 clicks before opening)
    const giftBox = document.querySelector('.gift-box');
    let giftClickCount = 0;
    const requiredDodges = 5;

    if (giftBox) {
        // Create playful badge for feedback
        const giftBadge = document.createElement('div');
        giftBadge.className = 'gift-badge';
        giftBadge.style.display = 'none';
        giftBox.appendChild(giftBadge);

        const dodgeHints = [
            "Oops! Catch me if you can! 😜",
            "Too slow! Try again! 🏃‍♂️💨",
            "Almost got it! Keep going! 🎁✨",
            "One more click to unlock! 🥳",
            "Yay! You unlocked your surprise! 🎉🎁"
        ];

        giftBox.addEventListener('click', (e) => {
            if (giftClickCount < requiredDodges) {
                e.preventDefault(); // Prevent navigating on initial clicks
                giftClickCount++;

                if (giftClickCount < requiredDodges) {
                    // Calculate random offset within range [-120px, 120px] x [-50px, 50px]
                    const randomX = (Math.random() - 0.5) * 260;
                    const randomY = (Math.random() - 0.5) * 100;
                    const randomRotate = (Math.random() - 0.5) * 35;

                    giftBox.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;

                    // Show hint badge
                    giftBadge.textContent = dodgeHints[giftClickCount - 1];
                    giftBadge.style.display = 'block';

                    // Trigger click particles
                    createClickEffect(e);
                } else {
                    // 5th click: Reset position, unlock with green badge and particles, then open link
                    giftBox.style.transform = 'translate(0, 0) scale(1.15)';
                    giftBox.classList.add('unlocked');
                    giftBadge.textContent = dodgeHints[requiredDodges - 1];
                    giftBadge.style.display = 'block';
                    giftBadge.style.background = '#27ae60';

                    // Celebration particle burst
                    for (let i = 0; i < 20; i++) {
                        setTimeout(() => {
                            createClickEffect({
                                clientX: e.clientX + (Math.random() - 0.5) * 120,
                                clientY: e.clientY + (Math.random() - 0.5) * 120
                            });
                        }, i * 35);
                    }

                    // Open Link after short celebration delay
                    setTimeout(() => {
                        window.open(giftBox.href, '_blank');
                    }, 700);
                }
            }
        });
    }
    function drawPath() {
        const dots = document.querySelectorAll('.memory-point .dot');
        const svg = document.getElementById('roadmap-svg');
        const path = document.getElementById('roadmap-path');
        if (!dots.length || !svg || !path) return;

        const roadmap = document.querySelector('.roadmap');
        const roadmapRect = roadmap.getBoundingClientRect();

        let d = '';
        for (let i = 0; i < dots.length; i++) {
            const dotRect = dots[i].getBoundingClientRect();
            // Center of dot relative to roadmap
            const x = dotRect.left + dotRect.width / 2 - roadmapRect.left;
            const y = dotRect.top + dotRect.height / 2 - roadmapRect.top;

            if (i === 0) {
                d += `M ${x} ${y} `;
            } else {
                const prevDotRect = dots[i - 1].getBoundingClientRect();
                const prevX = prevDotRect.left + prevDotRect.width / 2 - roadmapRect.left;
                const prevY = prevDotRect.top + prevDotRect.height / 2 - roadmapRect.top;

                // Natural s-curve between whatever x positions the dots are at!
                const cy = (y + prevY) / 2;
                d += `C ${prevX} ${cy}, ${x} ${cy}, ${x} ${y} `;
            }
        }
        path.setAttribute('d', d);
    }

    window.addEventListener('resize', drawPath);
    window.addEventListener('scroll', drawPath);
    // Give layout time to settle, then draw
    setTimeout(drawPath, 100);
    setTimeout(drawPath, 500);
    setTimeout(drawPath, 1000);

});
