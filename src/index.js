(function () {
  const thumbs = [...document.querySelectorAll('#carousel-thumbs button')];
  const main = document.getElementById('main-carousel-image');
  const counter = document.getElementById('carousel-counter');
  const title = document.getElementById('carousel-title');
  let current = 0;

  function show(i) {
    current = (i + thumbs.length) % thumbs.length;
    const t = thumbs[current];
    main.src = t.dataset.src;
    main.alt = t.querySelector('img').alt;
    title.textContent = t.dataset.title;
    counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(thumbs.length).padStart(2, '0');
    thumbs.forEach((b, n) => {
      const on = n === current;
      b.classList.toggle('border-2', on);
      b.classList.toggle('border-tertiary', on);
      b.classList.toggle('border', !on);
      b.classList.toggle('border-outline-variant/30', !on);
      b.classList.toggle('opacity-100', on);
      b.classList.toggle('opacity-60', !on);
    });
  }

  thumbs.forEach((b, n) => b.addEventListener('click', () => show(n)));
  document.getElementById('carousel-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('carousel-next').addEventListener('click', () => show(current + 1));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
