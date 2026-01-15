// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Ambil nama tamu dari URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || 'Tamu Undangan';
    document.getElementById('guest-name').textContent = guestName;
    
    // Inisialisasi komponen
    initOpenInvitation(); // Pindahkan ke atas untuk pastikan tombol berfungsi
    initMusicPlayer();
    initNavigation();
    initCountdown();
    initRSVP();
    initWishes();
    initBankCopy();
    initMapButtons();
    
    // Inisialisasi daftar RSVP dan ucapan
    displayRSVPList();
    displayWishesList();
    
    // Animasi scroll ke section
    initScrollAnimation();
    
    console.log('Initialization complete');
});

// Buka Undangan - PERBAIKAN UTAMA
function initOpenInvitation() {
    console.log('Initializing open invitation button...');
    
    const openBtn = document.getElementById('open-invitation');
    const openingPage = document.getElementById('opening-page');
    const mainContent = document.getElementById('main-content');
    
    if (!openBtn) {
        console.error('Open button not found!');
        return;
    }
    
    if (!openingPage) {
        console.error('Opening page not found!');
        return;
    }
    
    if (!mainContent) {
        console.error('Main content not found!');
        return;
    }
    
    console.log('All elements found, adding event listener...');
    
    openBtn.addEventListener('click', function(e) {
        console.log('Open button clicked!');
        e.preventDefault();
        
        // Animasi tombol
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 300);
        
        // Animasi keluar halaman pembuka
        openingPage.style.opacity = '0';
        openingPage.style.transform = 'scale(1.1)';
        openingPage.style.transition = 'all 0.8s ease';
        
        // Tampilkan halaman utama setelah delay
        setTimeout(() => {
            console.log('Switching to main content...');
            openingPage.classList.add('hidden');
            mainContent.classList.remove('hidden');
            
            // Scroll ke atas
            window.scrollTo(0, 0);
            
            // Animasi masuk untuk konten utama
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            mainContent.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
                
                // Panggil fungsi untuk memulai musik setelah halaman terbuka
                setTimeout(() => {
                    const musicToggle = document.getElementById('music-toggle');
                    const backgroundMusic = document.getElementById('background-music');
                    const musicIcon = musicToggle.querySelector('i');
                    
                    if (backgroundMusic && backgroundMusic.paused) {
                        backgroundMusic.play().then(() => {
                            console.log('Music started automatically');
                            musicIcon.className = 'fas fa-pause';
                            musicToggle.classList.add('playing');
                        }).catch(error => {
                            console.log('Autoplay blocked, user interaction required:', error);
                        });
                    }
                }, 500);
            }, 100);
        }, 800);
    });
    
    console.log('Event listener added successfully');
}

// Musik Player
function initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    
    if (!musicToggle || !backgroundMusic) {
        console.warn('Music player elements not found');
        return;
    }
    
    const musicIcon = musicToggle.querySelector('i');
    backgroundMusic.volume = 0.3;
    
    // Coba preload musik
    backgroundMusic.load();
    
    musicToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                musicIcon.className = 'fas fa-pause';
                musicToggle.classList.add('playing');
            }).catch(error => {
                console.log('Playback failed:', error);
                alert('Mohon interaksi dengan halaman terlebih dahulu untuk memutar musik');
            });
        } else {
            backgroundMusic.pause();
            musicIcon.className = 'fas fa-play';
            musicToggle.classList.remove('playing');
        }
    });
}

// Navigasi
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinksContainer) {
        console.warn('Navigation elements not found');
        return;
    }
    
    // Menu toggle untuk mobile
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        navLinksContainer.classList.toggle('active');
    });
    
    // Active link berdasarkan scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Smooth scroll untuk link navigasi
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Tutup menu mobile jika terbuka
                if (navLinksContainer) {
                    navLinksContainer.classList.remove('active');
                }
                
                // Scroll ke section
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Countdown Timer
function initCountdown() {
    // Tanggal pernikahan: 15 Juni 2024
    const weddingDate = new Date('June 15, 2024 08:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        // Hitung hari, jam, menit, detik
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update elemen jika ada
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // Jika waktu sudah habis
        if (timeLeft < 0) {
            const countdownTimer = document.querySelector('.countdown-timer');
            if (countdownTimer) {
                countdownTimer.innerHTML = '<div class="countdown-finished">Alhamdulillah, acara telah dilaksanakan!</div>';
            }
            clearInterval(countdownInterval);
        }
    }
    
    // Update setiap detik
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// RSVP System
function initRSVP() {
    const rsvpForm = document.getElementById('rsvp-form');
    
    if (!rsvpForm) {
        console.warn('RSVP form not found');
        return;
    }
    
    const decreaseBtn = document.getElementById('decrease-guest');
    const increaseBtn = document.getElementById('increase-guest');
    const guestCountInput = document.getElementById('guest-count');
    
    // Tombol jumlah tamu
    if (decreaseBtn && guestCountInput) {
        decreaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            let count = parseInt(guestCountInput.value);
            if (count > 1) {
                guestCountInput.value = count - 1;
            }
        });
    }
    
    if (increaseBtn && guestCountInput) {
        increaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            let count = parseInt(guestCountInput.value);
            if (count < 10) {
                guestCountInput.value = count + 1;
            }
        });
    }
    
    // Submit form RSVP
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('rsvp-name')?.value.trim();
        const guestCount = document.getElementById('guest-count')?.value;
        const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
        const message = document.getElementById('rsvp-message')?.value.trim();
        
        if (!name) {
            alert('Mohon masukkan nama lengkap Anda.');
            return;
        }
        
        // Simpan ke LocalStorage
        const rsvpData = {
            id: Date.now(),
            name: name,
            guestCount: guestCount || '1',
            attendance: attendance || 'Hadir',
            message: message || '',
            timestamp: new Date().toLocaleString('id-ID')
        };
        
        saveRSVPToLocalStorage(rsvpData);
        
        // Reset form
        rsvpForm.reset();
        if (guestCountInput) guestCountInput.value = 1;
        
        // Update daftar RSVP
        displayRSVPList();
        
        // Tampilkan notifikasi
        showNotification('Konfirmasi kehadiran berhasil disimpan!', 'success');
    });
}

// Simpan RSVP ke LocalStorage
function saveRSVPToLocalStorage(rsvpData) {
    let rsvpList = JSON.parse(localStorage.getItem('weddingRSVP')) || [];
    rsvpList.unshift(rsvpData); // Tambah di awal array
    
    // Simpan maksimal 50 entri
    if (rsvpList.length > 50) {
        rsvpList = rsvpList.slice(0, 50);
    }
    
    localStorage.setItem('weddingRSVP', JSON.stringify(rsvpList));
}

// Tampilkan daftar RSVP
function displayRSVPList() {
    const rsvpListContainer = document.getElementById('rsvp-list');
    if (!rsvpListContainer) return;
    
    const rsvpList = JSON.parse(localStorage.getItem('weddingRSVP')) || [];
    
    if (rsvpList.length === 0) {
        rsvpListContainer.innerHTML = '<p class="no-data">Belum ada konfirmasi kehadiran.</p>';
        return;
    }
    
    let html = '';
    rsvpList.forEach(item => {
        const attendanceClass = item.attendance === 'Hadir' ? 'attending' : 'not-attending';
        const attendanceIcon = item.attendance === 'Hadir' ? 'fas fa-check-circle' : 'fas fa-times-circle';
        const attendanceColor = item.attendance === 'Hadir' ? '#0a5c36' : '#c62828';
        
        html += `
            <div class="rsvp-item ${attendanceClass}">
                <div class="rsvp-name">${item.name}</div>
                <div class="rsvp-details">
                    <span><i class="${attendanceIcon}" style="color: ${attendanceColor};"></i> ${item.attendance}</span>
                    <span><i class="fas fa-user-friends"></i> ${item.guestCount} orang</span>
                    <span><i class="far fa-clock"></i> ${item.timestamp}</span>
                </div>
                ${item.message ? `<div class="rsvp-message">${item.message}</div>` : ''}
            </div>
        `;
    });
    
    rsvpListContainer.innerHTML = html;
}

// Sistem Ucapan
function initWishes() {
    const wishForm = document.getElementById('wish-form');
    
    if (!wishForm) {
        console.warn('Wish form not found');
        return;
    }
    
    wishForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('wish-name')?.value.trim();
        const message = document.getElementById('wish-message')?.value.trim();
        
        if (!name || !message) {
            alert('Mohon lengkapi nama dan ucapan Anda.');
            return;
        }
        
        // Simpan ke LocalStorage
        const wishData = {
            id: Date.now(),
            name: name,
            message: message,
            timestamp: new Date().toLocaleString('id-ID')
        };
        
        saveWishToLocalStorage(wishData);
        
        // Reset form
        wishForm.reset();
        
        // Update daftar ucapan
        displayWishesList();
        
        // Tampilkan notifikasi
        const notification = document.getElementById('wish-notification');
        if (notification) {
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    });
}

// Simpan ucapan ke LocalStorage
function saveWishToLocalStorage(wishData) {
    let wishList = JSON.parse(localStorage.getItem('weddingWishes')) || [];
    wishList.unshift(wishData); // Tambah di awal array
    
    // Simpan maksimal 100 ucapan
    if (wishList.length > 100) {
        wishList = wishList.slice(0, 100);
    }
    
    localStorage.setItem('weddingWishes', JSON.stringify(wishList));
}

// Tampilkan daftar ucapan
function displayWishesList() {
    const wishesListContainer = document.getElementById('wishes-list');
    if (!wishesListContainer) return;
    
    const wishList = JSON.parse(localStorage.getItem('weddingWishes')) || [];
    
    if (wishList.length === 0) {
        wishesListContainer.innerHTML = '<p class="no-data">Belum ada ucapan. Jadilah yang pertama!</p>';
        return;
    }
    
    let html = '';
    wishList.forEach(item => {
        html += `
            <div class="wish-item">
                <div class="wish-header">
                    <div class="wish-name">${item.name}</div>
                    <div class="wish-time">${item.timestamp}</div>
                </div>
                <div class="wish-message">${item.message}</div>
            </div>
        `;
    });
    
    wishesListContainer.innerHTML = html;
}

// Salin nomor rekening
function initBankCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    const notification = document.getElementById('copy-notification');
    
    if (copyButtons.length === 0) {
        console.warn('Copy buttons not found');
        return;
    }
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const bankCard = this.closest('.bank-card');
            const bankNumber = bankCard.querySelector('.bank-value')?.textContent;
            
            if (!bankNumber) {
                console.error('Bank number not found');
                return;
            }
            
            // Salin ke clipboard
            navigator.clipboard.writeText(bankNumber).then(() => {
                // Tampilkan notifikasi
                if (notification) {
                    notification.classList.add('show');
                    
                    setTimeout(() => {
                        notification.classList.remove('show');
                    }, 3000);
                }
                
                // Animasi tombol
                this.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
                this.style.background = 'var(--secondary-green)';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> Salin Nomor Rekening';
                    this.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Gagal menyalin: ', err);
                alert('Gagal menyalin nomor rekening. Silakan salin manual.');
            });
        });
    });
}

// Tombol Peta
function initMapButtons() {
    const mapButtons = document.querySelectorAll('.map-btn');
    const mapModal = document.getElementById('map-modal');
    const modalClose = document.querySelector('.modal-close');
    
    if (mapButtons.length === 0 || !mapModal || !modalClose) {
        console.warn('Map elements not found');
        return;
    }
    
    const modalLocation = document.getElementById('modal-location');
    const locationDetails = document.getElementById('location-details');
    
    mapButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const location = this.getAttribute('data-location');
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard?.querySelector('.event-title')?.textContent || 'Lokasi Acara';
            
            if (modalLocation) modalLocation.textContent = eventTitle;
            if (locationDetails) locationDetails.textContent = location;
            
            mapModal.classList.add('active');
        });
    });
    
    // Tutup modal
    modalClose.addEventListener('click', function(e) {
        e.preventDefault();
        mapModal.classList.remove('active');
    });
    
    // Tutup modal saat klik di luar
    mapModal.addEventListener('click', function(e) {
        if (e.target === mapModal) {
            mapModal.classList.remove('active');
        }
    });
}

// Animasi scroll
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Amati semua section
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Notifikasi
function showNotification(message, type = 'info') {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style notifikasi
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-green)' : '#ff9800'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Tampilkan notifikasi
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Tambahkan style untuk notifikasi tambahan
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-green);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background: var(--primary-green);
    }
    
    .notification.info {
        background: #2196f3;
    }
`;
document.head.appendChild(style);