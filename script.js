// Highlight current page and mobile menu
const page = document.body.dataset.page;
document.querySelectorAll('nav a').forEach(a => {
  if (a.getAttribute('href').startsWith(page === 'home' ? 'index' : page)) a.classList.add('active');
});
document.getElementById('menu-btn').addEventListener('click', () => document.getElementById('nav').classList.toggle('open'));

// ---------- Academic planner ----------
const taskForm = document.getElementById('task-form');
if (taskForm) {
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]'); // array of {text, done}
  const list = document.getElementById('task-list');
  const input = document.getElementById('task-input');
  const msg = document.getElementById('task-msg');
  const count = document.getElementById('task-count');

  function save() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

  function render() {
    list.innerHTML = '';
    tasks.forEach((t, i) => {
      const li = document.createElement('li');
      if (t.done) li.classList.add('done');
      const box = document.createElement('input');
      box.type = 'checkbox'; box.checked = t.done; box.style.width = 'auto';
      box.addEventListener('change', () => toggleTask(i));
      const span = document.createElement('span'); span.textContent = t.text;
      const del = document.createElement('button'); del.textContent = 'Delete';
      del.addEventListener('click', () => deleteTask(i));
      li.append(box, span, del); list.appendChild(li);
    });
    const left = tasks.filter(t => !t.done).length;
    count.textContent = tasks.length ? left + ' of ' + tasks.length + ' tasks still to do' : 'No tasks yet. Add your first one above.';
  }
  function addTask(text) { tasks.push({ text: text, done: false }); save(); render(); }
  function toggleTask(i) { tasks[i].done = !tasks[i].done; save(); render(); }
  function deleteTask(i) { tasks.splice(i, 1); save(); render(); }

  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { msg.textContent = 'Please type a task before adding.'; return; }
    msg.textContent = ''; addTask(text); input.value = '';
  });
  render();
}

// ---------- Contact form validation ----------
const form = document.getElementById('contact-form');
if (form) {
  const fields = ['name', 'email', 'phone', 'message'];
  function setErr(id, text) { document.getElementById('e-' + id).textContent = text; }
  function validate() {
    let ok = true;
    fields.forEach(id => {
      const v = document.getElementById(id).value.trim();
      setErr(id, '');
      if (v === '') { setErr(id, 'This field cannot be empty.'); ok = false; }
      else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr(id, 'Enter a valid email like name@example.com.'); ok = false; }
      else if (id === 'phone' && !/^\d+$/.test(v)) { setErr(id, 'Phone number must contain digits only.'); ok = false; }
    });
    return ok;
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = document.getElementById('form-ok');
    if (validate()) { ok.textContent = 'Thank you! Your message has been sent.'; form.reset(); }
    else ok.textContent = '';
  });
}
