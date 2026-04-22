document.addEventListener('DOMContentLoaded', () => {
  loadPublicSite().catch((error) => {
    renderPublicSite({}, []);
    window.showToast(error.message || 'Gagal memuat konten website.');
  });
});

const DEMO_CONTENT = {
  schoolName: 'SMK SchoolOps Nusantara',
  phone: '(021) 555-7788',
  email: 'info@schoolops.sch.id',
  address: 'Jl. Pendidikan No. 10, Nusantara, Indonesia',
  heroImage: '/assets/hero-demo.svg',
  featureImage: '/assets/feature-demo.svg'
};

const DEMO_ANNOUNCEMENTS = [
  {
    Kategori: 'Prestasi',
    Judul: 'Tim siswa meraih juara inovasi teknologi tingkat provinsi',
    Isi: 'Kolaborasi siswa dan guru pembimbing berhasil mengangkat proyek aplikasi edukasi menjadi juara pada lomba inovasi digital.',
    'Tanggal Publikasi': '2026-04-12'
  },
  {
    Kategori: 'Agenda',
    Judul: 'Penerimaan Peserta Didik Baru gelombang 1 resmi dibuka',
    Isi: 'Calon siswa dapat melihat jadwal pendaftaran, berkas yang dibutuhkan, serta alur seleksi melalui informasi sekolah.',
    'Tanggal Publikasi': '2026-04-09'
  },
  {
    Kategori: 'Kemitraan',
    Judul: 'Sekolah memperkuat kerja sama dengan dunia usaha dan industri',
    Isi: 'Kemitraan baru ini memperluas peluang magang, kunjungan industri, dan sinkronisasi kurikulum berbasis kebutuhan kerja.',
    'Tanggal Publikasi': '2026-04-04'
  }
];

async function loadPublicSite() {
  const response = await fetch('/api/school?action=getPublicSiteContent');
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Gagal memuat konten website.');
  }

  renderPublicSite(data.data.websiteSettings || {}, data.data.announcements || []);
}

function renderPublicSite(settings, announcements) {
  const schoolName = settings['Nama Sekolah'] || DEMO_CONTENT.schoolName;
  const phone = settings.Telepon || DEMO_CONTENT.phone;
  const email = settings.Email || DEMO_CONTENT.email;
  const address = settings.Alamat || DEMO_CONTENT.address;
  const heroImage = settings['Hero Gambar'] || '';
  const featureImage = settings['Hero Gambar'] || '';
  const newsItems = announcements.length ? announcements : DEMO_ANNOUNCEMENTS;

  document.title = schoolName + ' | Website Sekolah';
  setText('schoolName', schoolName);
  setText('schoolTagline', settings.Tagline);
  setText('sidebarSchoolName', schoolName);
  setText('footerSchoolName', schoolName);
  setText('topPhone', phone);
  setText('topEmail', email);
  setText('footerAddress', address);
  setText('footerAddressBottom', address);
  setText('footerEmail', email);
  setText('footerEmailBottom', email);
  setText('footerPhone', phone);
  setText('footerPhoneBottom', phone);
  setText('heroTitle', settings['Hero Judul']);
  setText('heroDescription', settings['Hero Deskripsi']);
  setText('stat1Value', settings['Stat 1 Angka']);
  setText('stat1Label', settings['Stat 1 Label']);
  setText('stat2Value', settings['Stat 2 Angka']);
  setText('stat2Label', settings['Stat 2 Label']);
  setText('stat3Value', settings['Stat 3 Angka']);
  setText('stat3Label', settings['Stat 3 Label']);
  setText('aboutTitle', settings['Tentang Judul']);
  setText('aboutDescription', settings['Tentang Isi']);
  setText('program1Name', settings['Program 1 Nama']);
  setText('program1Description', settings['Program 1 Deskripsi']);
  setText('program2Name', settings['Program 2 Nama']);
  setText('program2Description', settings['Program 2 Deskripsi']);
  setText('program3Name', settings['Program 3 Nama']);
  setText('program3Description', settings['Program 3 Deskripsi']);

  const heroCta = document.getElementById('heroCta');
  heroCta.textContent = settings['Hero CTA Label'] || 'Info PPDB';
  heroCta.href = settings['Hero CTA Link'] || '#kontak';

  const brandSeal = document.getElementById('brandSeal');
  brandSeal.textContent = getInitials(schoolName);

  applyImageWithFallback(heroImage, DEMO_CONTENT.heroImage, '.classic-hero', 'hero-demo-background');
  applyImageWithFallback(featureImage, DEMO_CONTENT.featureImage, '.classic-feature-card__image', 'feature-demo-background');

  renderAnnouncements(newsItems);
  renderAgenda(newsItems);
}

function renderAnnouncements(announcements) {
  const container = document.getElementById('newsGrid');
  if (!announcements.length) {
    container.innerHTML = `
      <article class="classic-news-card">
        <span class="classic-badge">Informasi</span>
        <h4>Belum ada berita terbaru yang tayang.</h4>
        <p>Tambahkan pengumuman berstatus tayang dari dashboard admin untuk menampilkan berita terbaru di homepage.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = announcements.map((item) => `
    <article class="classic-news-card">
      <div class="classic-news-card__meta">
        <span class="classic-badge">${window.escapeHtml(item.Kategori || 'Informasi')}</span>
        <span>${window.formatDate(item['Tanggal Publikasi'])}</span>
      </div>
      <h4>${window.escapeHtml(item.Judul || '-')}</h4>
      <p>${window.escapeHtml(item.Isi || '-')}</p>
    </article>
  `).join('');
}

function renderAgenda(announcements) {
  const container = document.getElementById('agendaList');
  if (!announcements.length) {
    container.innerHTML = `
      <article class="sidebar-agenda__item">
        <h4>Belum ada agenda tayang.</h4>
        <p>Tambahkan pengumuman sekolah dari dashboard admin.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = announcements.slice(0, 4).map((item) => `
    <article class="sidebar-agenda__item">
      <h4>${window.escapeHtml(item.Judul || '-')}</h4>
      <p>${window.formatDate(item['Tanggal Publikasi'])} - ${window.escapeHtml(item.Kategori || 'Informasi')}</p>
    </article>
  `).join('');
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.textContent = value;
  }
}

function getInitials(name) {
  return String(name || 'SP')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function applyImageWithFallback(url, fallbackUrl, containerSelector, fallbackClass) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    return;
  }

  container.classList.add(fallbackClass);
  container.style.removeProperty('background-image');

  const primaryUrl = String(url || '').trim();
  const localFallbackUrl = String(fallbackUrl || '').trim();

  if (!primaryUrl && !localFallbackUrl) {
    return;
  }

  tryLoadImage(primaryUrl || localFallbackUrl, container, fallbackClass, localFallbackUrl);
}

function tryLoadImage(url, container, fallbackClass, localFallbackUrl) {
  const testImage = new Image();
  testImage.onload = function () {
    container.classList.remove(fallbackClass);
    container.style.backgroundImage = `linear-gradient(90deg, rgba(7, 32, 54, 0.3), rgba(7, 32, 54, 0.08)), url("${url}")`;
  };
  testImage.onerror = function () {
    if (localFallbackUrl && url !== localFallbackUrl) {
      tryLoadImage(localFallbackUrl, container, fallbackClass, '');
      return;
    }

    container.classList.add(fallbackClass);
  };
  testImage.src = url;
}
