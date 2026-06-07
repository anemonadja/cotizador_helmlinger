document.getElementById('logo-form').src = 'assets/img/Helmlinger_Logo_2026_b.png';
document.getElementById('logo-cot').src = 'assets/img/Helmlinger_Logo_2026_b.png';

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
  document.querySelectorAll('.tab').forEach((el, i) => el.classList.toggle('active', (i===0&&t==='nueva')||(i===1&&t==='compostura')));
  document.getElementById('panel-nueva').classList.toggle('hidden', t !== 'nueva');
  document.getElementById('panel-compostura').classList.toggle('hidden', t !== 'compostura');
  document.getElementById('cot-tipo-label').textContent = t === 'nueva' ? 'Cotización · Joya nueva' : 'Cotización · Composturas';
  document.getElementById('cot-row-piedras').style.display = t === 'nueva' ? '' : 'none';
  document.getElementById('cot-fab-label').textContent = t === 'nueva' ? 'Fabricación' : 'Compostura(s)';
  actualizarDesc();
  if (t === 'nueva') { toggleCustomVal(); calcular(); } else calcularArreglo();
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

function toggleCustomVal() {
  const sel = document.getElementById('tipo-producto');
  const wrap = document.getElementById('custom-value-wrap');
  wrap.classList.toggle('hidden', sel.value !== 'custom');
}

function calcular() {
  const sel = document.getElementById('tipo-producto');
  const fab = sel.value === 'custom'
    ? (parseFloat(document.getElementById('custom-valor').value) || 0)
    : (parseInt(sel.value) || 0);
  if (!fab && sel.value !== 'custom') { document.getElementById('total-display').textContent = '$—'; return; }
  const g = parseFloat(document.getElementById('gramos-metal').value) || 0;
  const pg = parseFloat(document.getElementById('precio-metal').value) || 0;
  const metal = g * pg;

  let piedras = 0;
  for (let i = 1; i <= 3; i++) {
    const cp = parseInt(document.getElementById('cant-piedras-' + i).value) || 0;
    const pp = parseFloat(document.getElementById('precio-piedra-' + i).value) || 0;
    const pe = parseFloat(document.getElementById('precio-engaste-' + i).value) || 0;
    piedras += cp * (pp + pe);
  }

  const margen = (parseFloat(document.getElementById('margen').value) || 0) / 100;
  const merma = (parseFloat(document.getElementById('merma').value) || 0) / 100;
  const descuento = (parseFloat(document.getElementById('descuento').value) || 0) / 100;
  const base = fab + metal + piedras;
  const margenTotal = base * (margen + merma);
  const subtotal = base + margenTotal;
  const total = subtotal * (1 - descuento);
  actualizarPreview(fab, metal, piedras, margenTotal, total);
}

function toggleCustomComp(n) {
  const sel = document.getElementById('tipo-compostura-' + n);
  const wrap = document.getElementById('comp-custom-wrap-' + n);
  wrap.classList.toggle('hidden', sel.value !== 'transformacion' && sel.value !== 'custom');
}

function calcularArreglo() {
  let fab = 0;
  for (let i = 1; i <= 3; i++) {
    const sel = document.getElementById('tipo-compostura-' + i);
    const val = sel.value;
    if (val === 'transformacion' || val === 'custom') {
      fab += parseFloat(document.getElementById('comp-custom-valor-' + i).value) || 0;
    } else {
      fab += parseInt(val) || 0;
    }
  }
  if (!fab) { document.getElementById('total-display').textContent = '$—'; return; }
  const comp = parseFloat(document.getElementById('complejidad').value) || 1;
  const gm = parseFloat(document.getElementById('metal-arreglo').value) || 0;
  const margen = (parseFloat(document.getElementById('margen-a').value) || 0) / 100;
  const merma = (parseFloat(document.getElementById('merma-a').value) || 0) / 100;
  const base = fab * comp;
  const vm = parseFloat(document.getElementById('valor-metal-arreglo').value) || 0;
  const metal = gm * vm;
  const subtotal = base + metal;
  const margenTotal = subtotal * (margen + merma);
  const total = subtotal + margenTotal;
  actualizarPreview(fab, metal, 0, margenTotal, total);
}

function actualizarCliente() {
  document.getElementById('cot-cliente').textContent = document.getElementById('nombre-cliente').value || '';
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
