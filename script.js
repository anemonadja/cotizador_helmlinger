document.getElementById('logo-form').src = 'assets/img/Helmlinger_Logo_2026_b.png';
document.getElementById('logo-cot').src = 'assets/img/Helmlinger_Logo_2026_b.png';

const PRECIOS_DEFAULT = {
  'p-anillo-cintillo': 35000,
  'p-anillo-medio-cintillo': 40000,
  'p-anillo-solitario': 45000,
  'p-aros-adulto': 42000,
  'p-aros-infantil': 25000,
  'p-cadena': 30000,
  'p-collar': 55000,
  'p-colgante': 35000,
  'p-pulsera-cadena': 40000,
  'p-pulsera-esclava': 45000,
  'p-argolla': 28000,
  'p-par-argollas': 50000,
  'p-cambio-tamano': 15000,
  'p-soldadura': 18000,
  'p-engaste-piedras': 22000,
  'p-limpieza': 25000,
  'p-reparacion-broche': 30000,
  'p-reengaste': 35000,
  'p-bano-rodio': 20000,
  'p-precio-metal': 3800,
  'p-valor-metal-arreglo': 3800,
  'p-margen': 35,
  'p-merma': 5
};

const PROD_MAP = [
  ['Anillo cintillo', 'p-anillo-cintillo'],
  ['Anillo medio cintillo', 'p-anillo-medio-cintillo'],
  ['Anillo solitario', 'p-anillo-solitario'],
  ['Aros adulto', 'p-aros-adulto'],
  ['Aros infantil', 'p-aros-infantil'],
  ['Cadena', 'p-cadena'],
  ['Collar', 'p-collar'],
  ['Colgante', 'p-colgante'],
  ['Pulsera cadena', 'p-pulsera-cadena'],
  ['Pulsera esclava', 'p-pulsera-esclava'],
  ['Argolla', 'p-argolla'],
  ['Par de argollas', 'p-par-argollas']
];

const COMP_MAP = [
  ['Cambio de tamaño', 'p-cambio-tamano'],
  ['Soldadura', 'p-soldadura'],
  ['Engaste de piedra(s)', 'p-engaste-piedras'],
  ['Limpieza ultrasónica y pulido', 'p-limpieza'],
  ['Reparación de broche', 'p-reparacion-broche'],
  ['Reengaste con nueva montura', 'p-reengaste'],
  ['Baño de rodio', 'p-bano-rodio']
];

function cargarPrecios() {
  const saved = localStorage.getItem('helmlinger_precios');
  const data = saved ? JSON.parse(saved) : PRECIOS_DEFAULT;

  const prodSel = document.getElementById('tipo-producto');
  if (prodSel) {
    for (const [label, key] of PROD_MAP) {
      const opt = Array.from(prodSel.options).find(o => o.textContent === label);
      if (opt) opt.value = data[key] || 0;
    }
  }

  for (let i = 1; i <= 3; i++) {
    const sel = document.getElementById('tipo-compostura-' + i);
    if (!sel) continue;
    for (const [label, key] of COMP_MAP) {
      const opt = Array.from(sel.options).find(o => o.textContent === label);
      if (opt) opt.value = data[key] || 0;
    }
  }

  const defaultMap = {
    'precio-metal': 'p-precio-metal',
    'margen': 'p-margen',
    'merma': 'p-merma',
    'valor-metal-arreglo': 'p-valor-metal-arreglo'
  };
  for (const [id, key] of Object.entries(defaultMap)) {
    const el = document.getElementById(id);
    if (el && data[key] !== undefined) el.value = data[key];
  }
}

const hoy = new Date();
const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
document.getElementById('cot-fecha').textContent = `${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;

function escalarPreview() {
  const wrap = document.getElementById('preview-wrap');
  const cot = document.getElementById('cotizacion');
  const disponible = wrap.clientWidth - 64;
  const escala = Math.min(1, disponible / 800);
  cot.style.transform = `scale(${escala})`;
  cot.style.marginBottom = `-${(1 - escala) * cot.offsetHeight}px`;
}

window.addEventListener('resize', escalarPreview);
window.addEventListener('load', escalarPreview);

let tabActual = 'nueva';
let fotoDataUrl = [null, null, null];

function setTab(t) {
  tabActual = t;
  document.querySelectorAll('.tab').forEach((el, i) => el.classList.toggle('active',
    (i===0&&t==='nueva')||(i===1&&t==='compostura')||(i===2&&t==='generico')));
  document.getElementById('panel-nueva').classList.toggle('hidden', t !== 'nueva');
  document.getElementById('panel-compostura').classList.toggle('hidden', t !== 'compostura');
  document.getElementById('panel-generico').classList.toggle('hidden', t !== 'generico');
  document.getElementById('cot-tipo-label').textContent = t === 'nueva' ? 'Cotización · Joya nueva'
    : t === 'compostura' ? 'Cotización · Composturas' : 'Cotización';

  const isNueva = t === 'nueva';
  const isComp = t === 'compostura';
  document.getElementById('cot-row-fab').style.display = 'none';
  document.getElementById('cot-row-metal').style.display = 'none';
  document.getElementById('cot-row-piedras').style.display = 'none';
  document.getElementById('cot-row-margen').style.display = 'none';
  document.getElementById('cot-row-piedras-nueva').style.display = isNueva ? '' : 'none';
  document.getElementById('cot-row-comp-detalle').style.display = isComp ? '' : 'none';
  document.getElementById('cot-row-descuento').style.display = '';

  document.getElementById('cot-fab-label').textContent = t === 'nueva' ? 'Fabricación'
    : t === 'compostura' ? 'Compostura(s)' : 'Producto';
  actualizarDesc();
  if (t === 'nueva') { toggleCustomVal(); calcular(); }
  else if (t === 'compostura') calcularArreglo();
  else calcularGenerico();
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
  if (!fab && sel.value !== 'custom') {
    document.getElementById('total-display').textContent = '$—';
    document.getElementById('cot-row-piedras-nueva').style.display = 'none';
    document.getElementById('cot-row-descuento').style.display = 'none';
    return;
  }
  const g = parseFloat(document.getElementById('gramos-metal').value) || 0;
  const pg = parseFloat(document.getElementById('precio-metal').value) || 0;
  const metal = g * pg;

  let piedras = 0;
  const piedrasDetalle = [];
  for (let i = 1; i <= 3; i++) {
    const cp = parseInt(document.getElementById('cant-piedras-' + i).value) || 0;
    const tp = document.getElementById('tipo-piedra-' + i).value.trim();
    const pp = parseFloat(document.getElementById('precio-piedra-' + i).value) || 0;
    const pe = parseFloat(document.getElementById('precio-engaste-' + i).value) || 0;
    piedras += cp * (pp + pe);
    if (cp > 0 && tp) {
      piedrasDetalle.push(cp + ' ' + tp);
    }
  }

  const margen = (parseFloat(document.getElementById('margen').value) || 0) / 100;
  const merma = (parseFloat(document.getElementById('merma').value) || 0) / 100;
  const descuento = (parseFloat(document.getElementById('descuento').value) || 0) / 100;
  const base = fab + metal + piedras;
  const margenTotal = base * (margen + merma);
  const subtotal = base + margenTotal;
  const total = subtotal * (1 - descuento);

  const pRow = document.getElementById('cot-row-piedras-nueva');
  const pVal = document.getElementById('cot-piedras-nueva-val');
  if (piedrasDetalle.length > 0) {
    pVal.textContent = piedrasDetalle.join(', ');
    pRow.style.display = '';
  } else {
    pVal.textContent = '—';
    pRow.style.display = 'none';
  }

  const dRow = document.getElementById('cot-row-descuento');
  const dVal = document.getElementById('cot-descuento-val');
  if (descuento > 0) {
    dVal.textContent = Math.round(descuento * 100) + '%';
    dRow.style.display = '';
  } else {
    dVal.textContent = '—';
    dRow.style.display = 'none';
  }

  actualizarPreview(fab, metal, piedras, margenTotal, total);
}

function toggleCustomComp(n) {
  const sel = document.getElementById('tipo-compostura-' + n);
  const wrap = document.getElementById('comp-custom-wrap-' + n);
  wrap.classList.toggle('hidden', sel.value !== 'transformacion' && sel.value !== 'custom');
}

function calcularArreglo() {
  let fab = 0;
  const compLabels = [];
  for (let i = 1; i <= 3; i++) {
    const sel = document.getElementById('tipo-compostura-' + i);
    const val = sel.value;
    if (val !== '0') {
      compLabels.push(sel.selectedOptions[0].text);
    }
    if (val === 'transformacion' || val === 'custom') {
      fab += parseFloat(document.getElementById('comp-custom-valor-' + i).value) || 0;
    } else {
      fab += parseInt(val) || 0;
    }
  }
  if (!fab) {
    document.getElementById('total-display').textContent = '$—';
    document.getElementById('cot-row-descuento').style.display = 'none';
    document.getElementById('cot-row-comp-detalle').style.display = 'none';
    return;
  }
  const comp = parseFloat(document.getElementById('complejidad').value) || 1;
  const gm = parseFloat(document.getElementById('metal-arreglo').value) || 0;
  const margen = (parseFloat(document.getElementById('margen-a').value) || 0) / 100;
  const merma = (parseFloat(document.getElementById('merma-a').value) || 0) / 100;
  const descuento = (parseFloat(document.getElementById('descuento-arreglo').value) || 0) / 100;
  const base = fab * comp;
  const vm = parseFloat(document.getElementById('valor-metal-arreglo').value) || 0;
  const metal = gm * vm;
  const subtotal = base + metal;
  const margenTotal = subtotal * (margen + merma);
  const total = (subtotal + margenTotal) * (1 - descuento);

  const cRow = document.getElementById('cot-row-comp-detalle');
  const cVal = document.getElementById('cot-comp-detalle-val');
  if (compLabels.length > 0) {
    cVal.textContent = compLabels.join(', ');
    cRow.style.display = '';
  } else {
    cVal.textContent = '—';
    cRow.style.display = 'none';
  }

  const dRow = document.getElementById('cot-row-descuento');
  const dVal = document.getElementById('cot-descuento-val');
  if (descuento > 0) {
    dVal.textContent = Math.round(descuento * 100) + '%';
    dRow.style.display = '';
  } else {
    dVal.textContent = '—';
    dRow.style.display = 'none';
  }

  actualizarPreview(fab, metal, 0, margenTotal, total);
}

function calcularGenerico() {
  const precio = parseFloat(document.getElementById('precio-directo').value) || 0;
  const desc = (parseFloat(document.getElementById('descuento-generico').value) || 0) / 100;
  const total = precio * (1 - desc);
  document.getElementById('total-display').textContent = total > 0 ? fmt(total) : '$—';
  document.getElementById('cot-total-val').textContent = total > 0 ? fmt(total) : '$—';

  const dRow = document.getElementById('cot-row-descuento');
  const dVal = document.getElementById('cot-descuento-val');
  if (desc > 0) {
    dVal.textContent = Math.round(desc * 100) + '%';
    dRow.style.display = '';
  } else {
    dVal.textContent = '—';
    dRow.style.display = 'none';
  }
}

function actualizarCliente() {
  document.getElementById('cot-cliente').textContent = document.getElementById('nombre-cliente').value || '';
}

function actualizarDesc() {
  const id = tabActual === 'nueva' ? 'descripcion-nueva'
    : tabActual === 'compostura' ? 'descripcion-arreglo'
    : 'descripcion-generico';
  const val = document.getElementById(id).value;
  document.getElementById('cot-desc').textContent = val || 'Ingresa la descripción del producto para el cliente.';
}

function toggleFoto(n) {
  const checked = document.getElementById('incluir-foto-' + n).checked;
  const img = document.getElementById('cot-foto-' + n);
  if (checked && fotoDataUrl[n - 1]) {
    img.classList.remove('hidden');
  } else {
    img.classList.add('hidden');
  }
  mostrarFotosSection();
  setTimeout(escalarPreview, 50);
}

function cargarFoto(e, n) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    fotoDataUrl[n - 1] = ev.target.result;
    const img = document.getElementById('cot-foto-' + n);
    img.src = fotoDataUrl[n - 1];
    document.getElementById('incluir-foto-' + n).checked = true;
    img.classList.remove('hidden');
    mostrarFotosSection();
    setTimeout(escalarPreview, 100);
  };
  reader.readAsDataURL(file);
}

function mostrarFotosSection() {
  const section = document.getElementById('cot-fotos-section');
  const anyVisible = [1,2,3].some(i => {
    return document.getElementById('incluir-foto-' + i).checked && fotoDataUrl[i - 1];
  });
  section.classList.toggle('hidden', !anyVisible);
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
    width: 800,
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

cargarPrecios();
calcular();
