const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// hero: the large print slowly changes between three projects
const shots = [...document.querySelectorAll('[data-crossfade] img')];
let shot = 0;
shots[0]?.classList.add('on');
if (!still && shots.length > 1) {
  setInterval(() => {
    if (document.hidden) return;
    shots[shot].classList.remove('on');
    shot = (shot + 1) % shots.length;
    shots[shot].classList.add('on');
  }, 5600);
}

// entrances, staggered among siblings
const rv = [...document.querySelectorAll('.rv')];
rv.forEach(el => el.style.setProperty('--i', [...el.parentElement.children].filter(c => c.classList.contains('rv')).indexOf(el) % 5));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  rv.forEach(el => io.observe(el));
} else rv.forEach(el => el.classList.add('in'));

// one item of a group is active at a time
function group(items, onPick) {
  const pick = i => { items.forEach((el, j) => { el.classList.toggle('on', j === i); el.classList.toggle('is-active', j === i); }); onPick(i); };
  items.forEach((el, i) => ['mouseenter', 'focusin', 'click'].forEach(ev => el.addEventListener(ev, () => pick(i))));
  pick(0);
}

// work: names on the left, the active project's picture in the fixed frame
const frame = document.querySelector('.frame');
const projs = [...document.querySelectorAll('.proj')];
const previews = projs.map(p => frame.appendChild(p.querySelector('.proj-media').firstElementChild.cloneNode(true)));
group(projs, i => previews.forEach((el, j) => el.classList.toggle('on', j === i)));

// record: one lit cell per course, sized by credits; pick a term to light its row
const scan = document.querySelector('.scan');
const terms = [...document.querySelectorAll('.terms li')];
const rows = terms.map(li => {
  const row = scan.appendChild(document.createElement('div'));
  row.className = 'scan-row';
  li.querySelector('p').dataset.c.split(',').forEach(c => { const b = row.appendChild(document.createElement('b')); b.style.flex = c; b.textContent = 'A'; });
  return row;
});
group(terms, i => {
  rows.forEach((r, j) => r.classList.toggle('on', j === i));
  terms.forEach((li, j) => li.querySelector('button').setAttribute('aria-expanded', j === i));
});
