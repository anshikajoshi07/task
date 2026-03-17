const form = document.getElementById('internshipForm');
const entriesEl = document.getElementById('entries');
const msgEl = document.getElementById('resultMessage');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let editingIndex = null;

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  const sanitized = phone.replace(/\D/g, '');
  return /^\d{10}$/.test(sanitized);
}

function clearForm() {
  form.reset();
  editingIndex = null;
  form.querySelector('button[type="submit"]').textContent = 'Submit';
  cancelEditBtn.style.display = 'none';
}

function setEditMode(index, item) {
  editingIndex = index;
  form.fullName.value = item.fullName;
  form.email.value = item.email;
  form.phone.value = item.phone;
  form.portfolio.value = item.portfolio;
  form.taskDetails.value = item.taskDetails;
  form.querySelector('button[type="submit"]').textContent = 'Update';
  cancelEditBtn.style.display = 'inline-block';
}

function renderEntries() {
  const raw = localStorage.getItem('internshipSubmissions');
  const data = raw ? JSON.parse(raw) : [];
  entriesEl.innerHTML = data.length ? data.map((item, idx) => {
    return `
      <div class='item'>
        <strong>${item.fullName}</strong> (<em>${item.email}</em>)<br>
        Phone: ${item.phone}<br>
        Portfolio: ${item.portfolio || '-'}<br>
        <p>${item.taskDetails.replace(/\n/g, '<br>')}</p>
        <small>Submitted: ${new Date(item.date).toLocaleString()}</small><br>
        <button data-index=${idx} class='edit-btn' style='margin-top:6px;padding:4px 8px;font-size:0.8rem;color:#1f4f95;background:#d9edff;border:1px solid #a6c9e1;border-radius:6px;cursor:pointer;margin-right:8px;'>Edit</button>
        <button data-index=${idx} class='delete-btn' style='margin-top:6px;padding:4px 8px;font-size:0.8rem;color:#823434;background:#fee6e6;border:1px solid #f2c2c2;border-radius:6px;cursor:pointer'>Delete</button>
      </div>`;
  }).join('') : '<p>No submissions yet.</p>';

  entriesEl.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', e => {
      const idx = Number(e.target.dataset.index);
      data.splice(idx, 1);
      localStorage.setItem('internshipSubmissions', JSON.stringify(data));
      clearForm();
      renderEntries();
    });
  });

  entriesEl.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', e => {
      const idx = Number(e.target.dataset.index);
      setEditMode(idx, data[idx]);
    });
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  msgEl.textContent = '';
  msgEl.className = 'message';

  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const portfolio = form.portfolio.value.trim();
  const taskDetails = form.taskDetails.value.trim();

  if (!fullName || !email || !phone || !taskDetails) {
    msgEl.textContent = 'Please fill all required fields.';
    msgEl.classList.add('error');
    return;
  }

  if (!validateEmail(email)) {
    msgEl.textContent = 'Please enter a valid email address.';
    msgEl.classList.add('error');
    return;
  }

  if (!validatePhone(phone)) {
    msgEl.textContent = 'Phone must be 10 digits (India-style).';
    msgEl.classList.add('error');
    return;
  }

  const entry = { fullName, email, phone, portfolio, taskDetails, date: new Date().toISOString() };
  const oldEntries = JSON.parse(localStorage.getItem('internshipSubmissions') || '[]');

  if (editingIndex !== null) {
    oldEntries[editingIndex] = entry;
    msgEl.textContent = 'Entry updated successfully.';
  } else {
    oldEntries.unshift(entry);
    msgEl.textContent = 'Submission successful (saved locally).';
  }

  localStorage.setItem('internshipSubmissions', JSON.stringify(oldEntries));
  msgEl.classList.add('success');
  clearForm();
  renderEntries();
});

cancelEditBtn.addEventListener('click', () => {
  clearForm();
  msgEl.textContent = 'Edit cancelled.';
  msgEl.className = 'message';
});

exportJsonBtn.addEventListener('click', () => {
  const raw = localStorage.getItem('internshipSubmissions');
  const data = raw ? JSON.parse(raw) : [];
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'internshipSubmissions.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

// Load persisted dark mode from localStorage (optional)
const savedDark = localStorage.getItem('darkModeEnabled') === 'true';
darkModeToggle.checked = savedDark;
document.body.classList.toggle('dark-mode', savedDark);

darkModeToggle.addEventListener('change', (e) => {
  const enabled = e.target.checked;
  document.body.classList.toggle('dark-mode', enabled);
  localStorage.setItem('darkModeEnabled', enabled);
});

renderEntries();