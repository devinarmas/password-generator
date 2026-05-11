const CHARS = {
upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
lower:   'abcdefghijklmnopqrstuvwxyz',
numbers: '0123456789',
symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~'
};

// Toggle option chips
document.getElementById('options').addEventListener('click', e => {
const label = e.target.closest('.opt');
if (!label) return;
const cb = label.querySelector('input[type=checkbox]');
cb.checked = !cb.checked;
label.classList.toggle('active', cb.checked);
});

// Slider
const slider = document.getElementById('lengthSlider');
const lenVal  = document.getElementById('lengthVal');
slider.addEventListener('input', () => lenVal.textContent = slider.value);

// Generate
document.getElementById('generateBtn').addEventListener('click', generate);

function getCharset() {
let s = '';
document.querySelectorAll('#options input[type=checkbox]').forEach(cb => {
    if (cb.checked) s += CHARS[cb.value];
});
return s || CHARS.lower; // fallback
}

function makePassword(len, charset) {
const arr = new Uint32Array(len);
crypto.getRandomValues(arr);
return Array.from(arr, n => charset[n % charset.length]).join('');
}

function generate() {
const len     = parseInt(slider.value);
const charset = getCharset();
const count   = 2;
const grid    = document.getElementById('passwordGrid');
grid.innerHTML = '';

for (let i = 0; i < count; i++) {
    const pw   = makePassword(len, charset);
    const chip = document.createElement('div');
    chip.className = 'pw-chip';
    chip.innerHTML = `
    <span class="pw-text">${pw}</span>
    <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
    <div class="flash"></div>`;
    chip.addEventListener('click', () => copyPw(chip, pw));
    grid.appendChild(chip);
}
}

let toastTimer;
function copyPw(chip, pw) {
navigator.clipboard.writeText(pw).then(() => {
    chip.classList.add('copied');
    setTimeout(() => chip.classList.remove('copied'), 600);
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
});
}

// Auto-generate on load
generate();
