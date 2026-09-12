    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, caption) {
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        openLightbox(img.src, btn.dataset.caption);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });


    async function loadDestinations() {
  try {
    const response = await fetch('./js/data/destinations.json');
    if (!response.ok) throw new Error('Could not load destinations.json');

    const destinations = await response.json();
    const groups = {};

    destinations.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    const container = document.getElementById('destination-groups');

    container.innerHTML = Object.entries(groups).map(([category, items]) => `
      <div class="mb-14">
        <p class="font-display text-2xl font-semibold mb-6 text-gold">${category}</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${items.map(item => `
            <a href="./detail.html?id=${item.id}" class="group">
              <figure>
                <img src="${item.image}" alt="${item.name}"
                     class="rounded-sm w-full h-40 object-cover mb-2 group-hover:opacity-80 transition">
                <figcaption class="text-sm font-medium">${item.name}</figcaption>
              </figure>
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error(error);
    document.getElementById('destination-groups').innerHTML =
      '<p class="text-red-300">Unable to load destination data.</p>';
  }
}

loadDestinations();

async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const container = document.getElementById('detail');

  if (!id) {
    container.innerHTML = `
      <div class="py-20 text-center">
        <h1 class="font-display text-4xl mb-4">Destination not found</h1>
        <a href="index.html#destinations" class="text-saffron font-semibold">Back to destinations</a>
      </div>`;
    return;
  }

  try {
    const response = await fetch('./js/data/destinations.json');
    if (!response.ok) throw new Error('Could not load destinations.json');

    const destinations = await response.json();
    const item = destinations.find(destination => destination.id === id);

    if (!item) {
      container.innerHTML = `
        <div class="py-20 text-center">
          <h1 class="font-display text-4xl mb-4">Destination not found</h1>
          <a href="index.html#destinations" class="text-saffron font-semibold">Back to destinations</a>
        </div>`;
      return;
    }

    document.title = `${item.name} | PP Taxi Service`;

    container.innerHTML = `
      <div class="mb-8">
        <a href="index.html#destinations" class="text-saffron font-semibold">← Back to destinations</a>
      </div>

      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <img src="${item.image}" alt="${item.name}"
               class="w-full h-[450px] object-cover rounded-sm shadow-lg">
        </div>

        <div>
          <p class="text-saffron text-sm font-semibold mb-3">${item.category}</p>
          <h1 class="font-display text-5xl font-semibold leading-tight mb-6">${item.name}</h1>
          <p class="text-muted text-lg leading-relaxed mb-5">${item.description}</p>
          <p class="font-semibold mb-8">📍 ${item.location}</p>

          <a href="index.html#book"
             class="inline-block bg-gold text-ink font-semibold px-6 py-3.5 rounded hover:bg-saffron hover:text-paper transition">
            Book this trip
          </a>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p class="text-red-700">Unable to load destination data.</p>';
  }
}

loadDetail();



// Hide page loader when everything is ready
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    // Small delay so the animation feels smooth
    setTimeout(() => {
      loader.classList.add('is-hidden');
      // Optional: remove from DOM after fade
      setTimeout(() => loader.remove(), 700);
    }, 400);
  }
});