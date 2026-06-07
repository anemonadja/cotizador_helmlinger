const LOGO_SRC = 'data:image/png;base64,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';

document.getElementById('logo-form').src = LOGO_SRC;
document.getElementById('logo-cot').src = LOGO_SRC;

const hoy = new Date();
const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
document.getElementById('cot-fecha').textContent = `${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;

function escalarPreview() {
  const wrap = document.getElementById('preview-wrap');
  const cot = document.getElementById('cotizacion');
  const disponible = wrap.clientWidth - 64;
  const escala = Math.min(1, disponible / 1080);
  cot.style.transform = `scale(${escala})`;
  cot.style.marginBottom = `-${(1 - escala) * cot.offsetHeight}px`;
}

window.addEventListener('resize', escalarPreview);
window.addEventListener('load', escalarPreview);

let tabActual = 'nueva';
let fotoDataUrl = null;

function setTab(t) {
  tabActual = t;
  document.querySelectorAll('.tab').forEach((el, i) => el.classList.toggle('active', (i===0&&t==='nueva')||(i===1&&t==='arreglo')));
  document.getElementById('panel-nueva').classList.toggle('hidden', t !== 'nueva');
  document.getElementById('panel-arreglo').classList.toggle('hidden', t !== 'arreglo');
  document.getElementById('cot-tipo-label').textContent = t === 'nueva' ? 'Cotización · Joya nueva' : 'Cotización · Arreglo';
  document.getElementById('cot-row-piedras').style.display = t === 'nueva' ? '' : 'none';
  document.getElementById('cot-fab-label').textContent = t === 'nueva' ? 'Fabricación' : 'Arreglo × complejidad';
  actualizarDesc();
  if (t === 'nueva') calcular(); else calcularArreglo();
}

function fmt(n) { return '$' + Math.round(n).toLocaleString('es-CL'); }

function actualizarPreview(fab, metal, piedras, margenTotal, total) {
  document.getElementById('total-display').textContent = fmt(total);
  document.getElementById('cot-fab-val').textContent = fmt(fab);
  document.getElementById('cot-metal-val').textContent = metal > 0 ? fmt(metal) : '—';
  document.getElementById('cot-piedras-val').textContent = piedras > 0 ? fmt(piedras) : '—';
  document.getElementById('cot-margen-val').textContent = fmt(margenTotal);
  document.getElementById('cot-total-val').textContent = fmt(total);
}

function calcular() {
  const fab = parseInt(document.getElementById('tipo-producto').value) || 0;
  if (!fab) { document.getElementById('total-display').textContent = '$—'; return; }
  const g = parseFloat(document.getElementById('gramos-metal').value) || 0;
  const pg = parseFloat(document.getElementById('precio-metal').value) || 0;
  const cp = parseInt(document.getElementById('cant-piedras').value) || 0;
  const pp = parseFloat(document.getElementById('precio-piedra').value) || 0;
  const pe = parseFloat(document.getElementById('precio-engaste').value) || 0;
  const margen = (parseFloat(document.getElementById('margen').value) || 0) / 100;
  const merma = (parseFloat(document.getElementById('merma').value) || 0) / 100;
  const metal = g * pg;
  const piedras = cp * (pp + pe);
  const base = fab + metal + piedras;
  const margenTotal = base * (margen + merma);
  const total = base + margenTotal;
  actualizarPreview(fab, metal, piedras, margenTotal, total);
}

function calcularArreglo() {
  const base = parseInt(document.getElementById('tipo-arreglo').value) || 0;
  if (!base) { document.getElementById('total-display').textContent = '$—'; return; }
  const comp = parseFloat(document.getElementById('complejidad').value) || 1;
  const gm = parseFloat(document.getElementById('metal-arreglo').value) || 0;
  const margen = (parseFloat(document.getElementById('margen-a').value) || 0) / 100;
  const merma = (parseFloat(document.getElementById('merma-a').value) || 0) / 100;
  const fab = base * comp;
  const metal = gm * 3800;
  const subtotal = fab + metal;
  const margenTotal = subtotal * (margen + merma);
  const total = subtotal + margenTotal;
  actualizarPreview(fab, metal, 0, margenTotal, total);
}

function actualizarDesc() {
  const id = tabActual === 'nueva' ? 'descripcion-nueva' : 'descripcion-arreglo';
  const val = document.getElementById(id).value;
  document.getElementById('cot-desc').textContent = val || 'Ingresa la descripción del producto para el cliente.';
}

function toggleFoto() {
  const checked = document.getElementById('incluir-foto').checked;
  const ph = document.getElementById('cot-foto-placeholder');
  const img = document.getElementById('cot-foto');
  if (checked) {
    if (fotoDataUrl) { img.classList.remove('hidden'); ph.classList.add('hidden'); }
    else { ph.classList.remove('hidden'); img.classList.add('hidden'); }
  } else {
    img.classList.add('hidden'); ph.classList.add('hidden');
  }
  setTimeout(escalarPreview, 50);
}

function cargarFoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    fotoDataUrl = ev.target.result;
    const img = document.getElementById('cot-foto');
    img.src = fotoDataUrl;
    document.getElementById('incluir-foto').checked = true;
    img.classList.remove('hidden');
    document.getElementById('cot-foto-placeholder').classList.add('hidden');
    setTimeout(escalarPreview, 100);
  };
  reader.readAsDataURL(file);
}

function descargarJPG() {
  const cot = document.getElementById('cotizacion');
  const escalaActual = cot.style.transform;
  cot.style.transform = 'scale(1)';
  cot.style.marginBottom = '0';

  html2canvas(cot, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#0a0a0a',
    width: 1080,
    logging: false
  }).then(canvas => {
    const link = document.createElement('a');
    const fecha = new Date().toISOString().slice(0,10);
    link.download = `cotizacion_helmlinger_${fecha}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
    cot.style.transform = escalaActual;
    setTimeout(escalarPreview, 50);
  });
}

calcular();
