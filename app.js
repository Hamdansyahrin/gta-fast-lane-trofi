// GTA Fast Lane — Panduan Trofi GTA 6 (Bahasa Indonesia).
// Memuat data/trophies.json dan data/completion.json, menampilkan checklist
// trofi dan checklist 100%, lalu menyimpan progres di localStorage.
// Tidak ada jaringan selain file aplikasi sendiri; tanpa library.
const STORAGE_KEY = 'gta-fast-lane-trofi-v1';
const COMPLETION_KEY = 'gta-fast-lane-100-v1';
const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];
const GRADE_LABELS = { platinum: 'Platinum', gold: 'Emas', silver: 'Perak', bronze: 'Perunggu' };
const KIND_LABELS = {
  story: 'Cerita',
  completion: 'Penyelesaian',
  collectible: 'Koleksi',
  activity: 'Aktivitas',
  misc: 'Lainnya',
};

const listEl = document.getElementById('trophy-list');
const emptyEl = document.getElementById('empty');
const showingEl = document.getElementById('showing');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const statusEl = document.getElementById('status');
const spoilersEl = document.getElementById('spoilers');

let earned = new Set(loadProgress(STORAGE_KEY));
let done100 = new Set(loadProgress(COMPLETION_KEY));
let doc = null;
let comp = null;

function loadProgress(key) {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(raw) ? raw.filter((n) => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

function saveProgress(key, set) {
  localStorage.setItem(key, JSON.stringify([...set].sort((a, b) => a - b)));
}

function gradeLabel(grade) {
  return GRADE_LABELS[grade] ?? grade;
}

function isSpoilerHidden(trophy) {
  return spoilersEl.checked && trophy.hidden && !earned.has(trophy.id);
}

function trophyMatches(trophy) {
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = [trophy.name, trophy.description, trophy.guide, KIND_LABELS[trophy.kind] ?? trophy.kind]
      .join(' ')
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (gradeEl.value !== 'all' && trophy.grade !== gradeEl.value) return false;
  if (kindEl.value !== 'all' && trophy.kind !== kindEl.value) return false;
  if (statusEl.value === 'earned' && !earned.has(trophy.id)) return false;
  if (statusEl.value === 'unearned' && earned.has(trophy.id)) return false;
  if (statusEl.value === 'missable' && !trophy.missable) return false;
  if (statusEl.value === 'hidden' && !trophy.hidden) return false;
  return true;
}

function sourceLinks(trophy) {
  if (!trophy.sources || !trophy.sources.length) return '';
  const links = trophy.sources
    .map((key) => {
      const s = doc.sources[key];
      if (!s) return key;
      const a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = s.name;
      return a;
    });
  const p = document.createElement('p');
  p.className = 'card-sources';
  p.append(document.createTextNode('Sumber: '));
  links.forEach((link, i) => {
    if (i > 0) p.append(document.createTextNode(' · '));
    p.append(link);
  });
  return p;
}

function buildCard(trophy) {
  const li = document.createElement('li');
  li.className = 'trophy-card';
  li.dataset.id = String(trophy.id);
  if (earned.has(trophy.id)) li.classList.add('earned');
  if (trophy.hidden) li.classList.add('hidden-trophy');

  const top = document.createElement('div');
  top.className = 'card-top';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.id);
  box.setAttribute('aria-label', `Tandai ${trophy.name} sebagai didapat`);
  box.addEventListener('click', (event) => event.stopPropagation());
  box.addEventListener('change', () => {
    if (box.checked) earned.add(trophy.id);
    else earned.delete(trophy.id);
    saveProgress(STORAGE_KEY, earned);
    render();
  });
  top.append(box);

  const title = document.createElement('div');
  title.className = 'card-title';
  const h3 = document.createElement('h3');
  if (isSpoilerHidden(trophy)) {
    h3.textContent = 'Trofi tersembunyi';
    h3.classList.add('spoiler-name');
  } else {
    h3.textContent = trophy.name;
  }
  title.append(h3);
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = isSpoilerHidden(trophy)
    ? 'Tersembunyi di PlayStation sampai didapat — centang begitu kamu mendapatkannya untuk melihat nama dan panduannya.'
    : trophy.description;
  title.append(desc);
  top.append(title);
  li.append(top);

  const badges = document.createElement('div');
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge ${trophy.grade}`;
  gradeBadge.textContent = gradeLabel(trophy.grade);
  badges.append(gradeBadge);
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge kind';
  kindBadge.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  badges.append(kindBadge);
  if (trophy.hidden) {
    const b = document.createElement('span');
    b.className = 'badge hidden-badge';
    b.textContent = 'Tersembunyi';
    badges.append(b);
  }
  if (trophy.missable) {
    const b = document.createElement('span');
    b.className = 'badge missable-badge';
    b.textContent = 'Bisa terlewat';
    badges.append(b);
  }
  if (trophy.count) {
    const b = document.createElement('span');
    b.className = 'badge count-badge';
    b.textContent = `× ${trophy.count}`;
    badges.append(b);
  }
  if (trophy.guide.toLowerCase().includes('belum terkonfirmasi') || trophy.guide.toLowerCase().includes('belum dikonfirmasi')) {
    const b = document.createElement('span');
    b.className = 'badge unconfirmed-badge';
    b.textContent = 'Belum terkonfirmasi';
    badges.append(b);
  }
  li.append(badges);

  const guide = document.createElement('p');
  guide.className = 'card-guide';
  guide.textContent = isSpoilerHidden(trophy)
    ? 'Panduan tersembunyi sampai didapat — matikan pengaturan spoiler untuk membacanya lebih awal.'
    : trophy.guide;
  li.append(guide);

  if (!isSpoilerHidden(trophy)) {
    const sources = sourceLinks(trophy);
    if (sources) li.append(sources);
  }

  const more = document.createElement('p');
  more.className = 'card-more';
  more.textContent = 'Klik untuk panduan lengkap';
  li.append(more);

  li.addEventListener('click', () => {
    li.classList.toggle('open');
  });
  return li;
}

function renderProgress() {
  const total = doc.trophies.length;
  const done = doc.trophies.filter((t) => earned.has(t.id)).length;
  document.getElementById('progress-count').textContent = String(done);
  document.getElementById('progress-pct').textContent = `${Math.round((done / total) * 100)}%`;
  document.getElementById('progress-fill').style.width = `${(done / total) * 100}%`;
  const counts = document.getElementById('grade-counts');
  counts.replaceChildren();
  for (const grade of GRADE_ORDER) {
    const inGrade = doc.trophies.filter((t) => t.grade === grade);
    const got = inGrade.filter((t) => earned.has(t.id)).length;
    const li = document.createElement('li');
    li.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = `${got}/${inGrade.length}`;
    li.append(b, document.createTextNode(` ${gradeLabel(grade)}`));
    counts.append(li);
  }
  document.getElementById('platinum-line').textContent =
    done === total
      ? 'Platinum “Vice Got a Price!” didapat — kamu Legenda Leonida.'
      : 'Platinum “Vice Got a Price!” terbuka saat 54 trofi lainnya sudah didapat.';
  for (const el of document.querySelectorAll('.stage-trophies')) {
    const stage = Number(el.dataset.stage);
    const inStage = doc.trophies.filter((t) => t.roadmap_stage === stage);
    const got = inStage.filter((t) => earned.has(t.id)).length;
    el.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = `${got}/${inStage.length}`;
    el.append(b, document.createTextNode(` trofi di tahap ini.`));
  }
}

function render() {
  if (!doc) return;
  const shown = doc.trophies.filter(trophyMatches);
  listEl.replaceChildren(...shown.map(buildCard));
  emptyEl.hidden = shown.length > 0;
  showingEl.textContent = `Menampilkan ${shown.length} dari ${doc.trophies.length} trofi`;
  renderProgress();
}

function renderSources() {
  const ul = document.getElementById('source-list');
  for (const [key, s] of Object.entries(doc.sources)) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a);
    ul.append(li);
  }
  const c100 = comp.sources.powerpyx100;
  if (c100) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = c100.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = c100.name;
    li.append(a);
    ul.append(li);
  }
}

function renderCompletionProgress() {
  const total = comp.items.length;
  const done = comp.items.filter((it) => done100.has(it.id)).length;
  document.getElementById('completion-count').textContent = String(done);
  document.getElementById('completion-pct').textContent = `${Math.round((done / total) * 100)}%`;
  document.getElementById('completion-fill').style.width = `${(done / total) * 100}%`;
  document.getElementById('completion-line').textContent =
    done === total
      ? 'Semua 35 syarat selesai — trofi Emas “A Long Road” milikmu.'
      : 'Selesaikan semuanya untuk trofi Emas “A Long Road”.';
}

function renderCompletion() {
  const wrap = document.getElementById('completion-groups');
  wrap.replaceChildren();
  for (const group of comp.groups) {
    const items = comp.items.filter((it) => it.group === group.id);
    const got = items.filter((it) => done100.has(it.id)).length;
    const section = document.createElement('div');
    section.className = 'completion-group';
    const h3 = document.createElement('h3');
    h3.textContent = `${group.name} — ${got}/${items.length}`;
    section.append(h3);
    const ul = document.createElement('ul');
    ul.className = 'completion-list';
    for (const item of items) {
      const li = document.createElement('li');
      li.className = 'completion-item';
      if (done100.has(item.id)) li.classList.add('done');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = done100.has(item.id);
      box.setAttribute('aria-label', `Tandai ${item.title} sebagai selesai`);
      box.addEventListener('change', () => {
        if (box.checked) done100.add(item.id);
        else done100.delete(item.id);
        saveProgress(COMPLETION_KEY, done100);
        renderCompletion();
      });
      li.append(box);
      const body = document.createElement('div');
      body.className = 'completion-body';
      const title = document.createElement('h4');
      title.textContent = item.title;
      const target = document.createElement('span');
      target.className = 'completion-target';
      target.textContent = item.target;
      title.append(target);
      body.append(title);
      const guide = document.createElement('p');
      guide.textContent = item.guide;
      body.append(guide);
      li.append(body);
      ul.append(li);
    }
    section.append(ul);
    wrap.append(section);
  }
  renderCompletionProgress();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ game: doc.game, earned: [...earned].sort((a, b) => a - b), completion100: [...done100].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta-fast-lane-progres.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  const raw = JSON.parse(await file.text());
  const ids = Array.isArray(raw) ? raw : raw.earned;
  if (!Array.isArray(ids)) throw new Error('not a progress file');
  const valid = new Set(doc.trophies.map((t) => t.id));
  earned = new Set(ids.filter((n) => Number.isInteger(n) && valid.has(n)));
  if (Array.isArray(raw.completion100)) {
    const valid100 = new Set(comp.items.map((it) => it.id));
    done100 = new Set(raw.completion100.filter((n) => Number.isInteger(n) && valid100.has(n)));
    saveProgress(COMPLETION_KEY, done100);
    renderCompletion();
  }
  saveProgress(STORAGE_KEY, earned);
  render();
}

function applyUrlParams() {
  const params = new URLSearchParams(location.search);
  if (params.has('grade')) gradeEl.value = params.get('grade');
  if (params.has('kind')) kindEl.value = params.get('kind');
  if (params.has('status')) statusEl.value = params.get('status');
  if (params.get('spoilers') === 'off') spoilersEl.checked = false;
  if (params.get('missable') === '1') statusEl.value = 'missable';
  if (params.has('detail')) {
    const id = Number(params.get('detail'));
    requestAnimationFrame(() => {
      const card = listEl.querySelector(`[data-id="${id}"]`);
      if (card) {
        card.classList.add('open');
        card.scrollIntoView({ block: 'center' });
      }
    });
  }
}

searchEl.addEventListener('input', render);
gradeEl.addEventListener('change', render);
kindEl.addEventListener('change', render);
statusEl.addEventListener('change', render);
spoilersEl.addEventListener('change', render);
document.getElementById('export').addEventListener('click', exportProgress);
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    await importProgress(file);
  } catch {
    alert('File itu bukan ekspor progres GTA Fast Lane.');
  }
  event.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Hapus semua trofi yang sudah dicentang?')) {
    earned = new Set();
    saveProgress(STORAGE_KEY, earned);
    render();
  }
});
document.getElementById('show-missable').addEventListener('click', () => {
  statusEl.value = 'missable';
  render();
  document.getElementById('controls').scrollIntoView();
});

doc = await (await fetch('data/trophies.json')).json();
comp = await (await fetch('data/completion.json')).json();
applyUrlParams();
renderSources();
renderCompletion();
render();
