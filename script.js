// ====== KONFIGURASI TOKO ======
  // Ganti nomor di bawah ini dengan nomor WhatsApp toko Anda.
  // Format: kode negara TANPA tanda + atau 0 di depan. Contoh Indonesia: 62812xxxxxxx
  const WA_NUMBER = "6281348956115";
  const DEFAULT_MESSAGE = "Halo Kak, saya ingin tanya-tanya soal koleksi arloji.";

  function buildWaLink(message){
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  document.querySelectorAll('[data-wa]').forEach(el => {
    const product = el.getAttribute('data-product');
    const message = product
      ? `Halo Kak, saya tertarik dengan ${product}. Apakah masih tersedia?`
      : DEFAULT_MESSAGE;
    el.setAttribute('href', buildWaLink(message));
  });

  document.getElementById('navWaBtn').setAttribute('href', buildWaLink(DEFAULT_MESSAGE));
  document.getElementById('floatWaBtn').setAttribute('href', buildWaLink(DEFAULT_MESSAGE));

  // ====== EFEK 3D PADA GAMBAR JAM (HERO) ======
  (function initWatch3D(){
    const stage = document.getElementById('watchStage');
    const watch = document.getElementById('watch3d');
    if (!stage || !watch) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const maxTiltX = 16;   // derajat kemiringan atas-bawah
    const maxTiltY = 26;   // derajat kemiringan kiri-kanan

    // rAF-throttle: hanya 1 update transform per frame, bukan per event mousemove
    let pendingEvent = null;
    let rafId = null;

    function applyTilt(){
      rafId = null;
      if (!pendingEvent) return;
      const { clientX, clientY } = pendingEvent;
      pendingEvent = null;

      const rect = stage.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;  // 0..1
      const py = (clientY - rect.top) / rect.height;  // 0..1

      const rotateY = (px - 0.5) * 2 * maxTiltY;
      const rotateX = (0.5 - py) * 2 * maxTiltX;

      stage.classList.add('is-tilting');
      watch.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    }

    function handleMove(e){
      pendingEvent = e;
      if (rafId === null) rafId = requestAnimationFrame(applyTilt);
    }

    function resetTilt(){
      pendingEvent = null;
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      stage.classList.remove('is-tilting');
      watch.style.transform = '';
    }

    stage.addEventListener('mousemove', handleMove, { passive:true });
    stage.addEventListener('mouseleave', resetTilt);

    // Dukungan sentuh: sedikit miring mengikuti jari saat digeser
    stage.addEventListener('touchmove', (e) => {
      if (!e.touches || !e.touches[0]) return;
      handleMove(e.touches[0]);
    }, { passive:true });
    stage.addEventListener('touchend', resetTilt);

    // Jeda animasi hero (float/glow/platform) saat section tidak terlihat,
    // supaya GPU/CPU tidak terus bekerja saat pengguna sudah scroll jauh.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          stage.classList.toggle('is-offscreen', !entry.isIntersecting);
        });
      }, { threshold: 0 });
      io.observe(stage);
    }
  })();
