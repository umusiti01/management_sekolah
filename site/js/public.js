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
  document.title = (settings['Nama Sekolah'] || 'Website Sekolah') + ' | Website Sekolah';
  setText('schoolName', settings['Nama Sekolah']);
  setText('footerSchoolName', settings['Nama Sekolah']);
  setText('schoolTagline', settings.Tagline);
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
  setText('footerAddress', settings.Alamat);
  setText('footerEmail', settings.Email);
  setText('footerPhone', settings.Telepon);
  setText('ctaHeadline', 'Bangun masa depan siswa bersama ' + (settings['Nama Sekolah'] || 'sekolah Anda') + '.');
  setText('ctaDescription', settings['Tentang Isi']);

  const heroCta = document.getElementById('heroCta');
  heroCta.textContent = settings['Hero CTA Label'] || 'Lihat Selengkapnya';
  heroCta.href = settings['Hero CTA Link'] || '#kontak';

  const heroImage = document.getElementById('heroImage');
  heroImage.src = settings['Hero Gambar'] || '';
  heroImage.alt = (settings['Nama Sekolah'] || 'Sekolah') + ' hero image';

  document.getElementById('brandSeal').textContent = getInitials(settings['Nama Sekolah']);
  renderAnnouncements(announcements);
}

function renderAnnouncements(announcements) {
  const container = document.getElementById('newsGrid');
  if (!announcements.length) {
    container.innerHTML = `
      <article class="news-card">
        <span class="news-tag">Informasi</span>
        <h4>Belum ada berita terbaru yang tayang.</h4>
        <p>Tambahkan pengumuman berstatus tayang dari dashboard admin untuk menampilkan berita di homepage.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = announcements.map((item) => `
    <article class="news-card">
      <span class="news-tag">${window.escapeHtml(item.Kategori || 'Informasi')}</span>
      <h4>${window.escapeHtml(item.Judul || '-')}</h4>
      <p>${window.escapeHtml(item.Isi || '-')}</p>
      <div class="meta-line">
        <span>${window.formatDate(item['Tanggal Publikasi'])}</span>
        <span class="badge">${window.escapeHtml(item.Status || '-')}</span>
      </div>
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
