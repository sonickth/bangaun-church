document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if (toggle && navList) {
    toggle.addEventListener('click', () => navList.classList.toggle('open'));
    navList.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navList.classList.remove('open'))
    );
  }
  document.querySelectorAll('.foot-year').forEach(el => el.textContent = new Date().getFullYear());
});
