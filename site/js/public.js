document.addEventListener('DOMContentLoaded', () => {
  loadPublicSite().catch((error) => {
    window.showToast(error.message || 'Gagal memuat konten website.');
  });
});

async function loadPublicSite() {
  const response = await fetch('/api/school?action=getPublicSiteContent');
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Gagal memuat konten website.');
  }

  renderPublicSite(data.data.websiteSettings || {}, data.data.announcements || []);
}

function renderPublicSite(settings, announcements) {
  const schoolName = settings['Nama Sekolah'] || 'SMK SchoolOps Nusantara';
  const phone = settings.Telepon || '(021) 555-7788';
  const email = settings.Email || 'info@schoolops.sch.id';
  const address = settings.Alamat || 'Jl. Pendidikan No. 10, Nusantara, Indonesia';
  const heroImage = settings['Hero Gambar'] || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80';

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

  document.getElementById('heroImage').src = heroImage;
  document.getElementById('featureImage').src = heroImage;

  renderAnnouncements(announcements);
  renderAgenda(announcements);
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
