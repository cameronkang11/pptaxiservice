async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const container = document.getElementById('detail');

  // ID not found
  if (!id) {
    showNotFound(container);
    return;
  }

  try {
    const response = await fetch('./js/data/destinations.json');

    if (!response.ok) {
      throw new Error('Could not load destinations.json');
    }

    const destinations = await response.json();

    const item = destinations.find(destination => destination.id === id);

    // Destination not found
    if (!item) {
      showNotFound(container);
      return;
    }

    // Browser tab title
    document.title = `${item.name} | PP Taxi Service`;

    // Generate entire detail page
    container.innerHTML = `
      
      <!-- HERO -->
      <section class="max-w-6xl mx-auto px-6 pt-14 pb-16 grid md:grid-cols-12 gap-10 items-center">

        <div class="md:col-span-6 order-2 md:order-1">


          <p class="text-saffron text-sm font-semibold mt-5 mb-4 tracking-wide">
            ${item.category}
          </p>

          <h1 class="font-display text-[3rem] leading-[1.05] font-600 text-ink mb-6">
            ${item.name}
          </h1>

          <p class="text-lg text-muted max-w-md mb-8 leading-relaxed">
            ${item.description}
          </p>

          <div class="font-semibold mb-8">
            📍 ${item.location}
          </div>

          <div class="flex flex-wrap items-center gap-4">

            <a href="index.html"
               class="bg-gold text-ink font-semibold px-6 py-3.5 rounded hover:bg-gold-deep transition-colors">
              Back to home
            </a>

            <a href="#visit"
               class="text-ink font-semibold px-2 py-3.5 border-b-2 border-ink hover:border-saffron hover:text-saffron transition-colors">
              Planning a visit
            </a>

          </div>

        </div>


        <div class="md:col-span-6 order-1 md:order-2">

          <img
            src="${item.image}"
            alt="${item.name}"
            class="rounded-sm w-full h-[440px] object-cover shadow-[0_18px_40px_-12px_rgba(36,28,21,0.35)]"
          >

        </div>

      </section>


      <!-- ABOUT -->
      <section class="border-t border-line bg-white/40">

        <div class="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-12 gap-10">

          <div class="md:col-span-5">

            <p class="text-saffron text-sm font-semibold mb-3">
              ${item.about_title || 'About the destination'}
            </p>

            <h2 class="font-display text-3xl font-600 text-ink leading-tight">
              ${item.about_heading || item.name}
            </h2>

          </div>


          <div class="md:col-span-7">

            <p class="text-muted text-lg leading-relaxed mb-4">
              ${item.about_description_1 || ''}
            </p>

            <p class="text-muted text-lg leading-relaxed">
              ${item.about_description_2 || ''}
            </p>

          </div>

        </div>

      </section>


      <!-- GALLERY -->
      <section class="border-t border-line bg-ink text-paper">

        <div class="max-w-6xl mx-auto px-6 py-16">

          <p class="text-gold text-sm font-semibold mb-3">
            A closer look
          </p>

          <h2 class="font-display text-3xl font-600 mb-8">
            ${item.gallery_title || `${item.name}, from a few angles`}
          </h2>


          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

            ${generateGallery(item)}

          </div>

        </div>

      </section>


      <!-- PLANNING A VISIT -->
      <section id="visit" class="border-t border-line">

        <div class="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-12 gap-10 items-start">

          <div class="md:col-span-6">

            <p class="text-saffron text-sm font-semibold mb-3">
              Planning a visit
            </p>

            <h2 class="font-display text-3xl font-600 text-ink leading-tight mb-6">
              What to expect
            </h2>

            ${generatePlanning(item)}

          </div>


          <div class="md:col-span-6">

            <p class="text-saffron text-sm font-semibold mb-3">
              With Tommy
            </p>

            <h2 class="font-display text-3xl font-600 text-ink leading-tight mb-6">
              How the trip works
            </h2>

            <p class="text-muted text-lg leading-relaxed">
              ${item.trip_description ||
              `Tommy picks you up from your hotel, waits while you visit, and can suggest which other stops fit well into the same trip. There's no fixed itinerary — tell him how much time you have and he'll build the route around it.`}
            </p>

          </div>

        </div>

      </section>

    `;

  } catch (error) {

    console.error(error);

    container.innerHTML = `
      <div class="py-20 text-center">
        <h1 class="font-display text-4xl mb-4">
          Unable to load destination
        </h1>

        <p class="text-muted mb-6">
          Please try again later.
        </p>

        <a href="index.html#destinations"
           class="text-saffron font-semibold">
          Back to destinations
        </a>
      </div>
    `;
  }
}


/**
 * Show destination not found
 */
function showNotFound(container) {

  container.innerHTML = `
    <div class="py-20 text-center">

      <h1 class="font-display text-4xl mb-4">
        Destination not found
      </h1>

      <a href="index.html#destinations"
         class="text-saffron font-semibold">
        Back to destinations
      </a>

    </div>
  `;
}


/**
 * Generate gallery images
 */
function generateGallery(item) {

  // If JSON has gallery array
  if (Array.isArray(item.gallery) && item.gallery.length > 0) {

    return item.gallery
      .slice(0, 4)
      .map((image, index) => `
        <img
          src="${image}"
          alt="${item.name} gallery image ${index + 1}"
          class="rounded-sm h-40 w-full object-cover"
        >
      `)
      .join('');
  }


  // If no gallery exists
  // Use main image four times
  return Array.from({ length: 4 }, (_, index) => `
    <img
      src="${item.image}"
      alt="${item.name} ${index + 1}"
      class="rounded-sm h-40 w-full object-cover"
    >
  `).join('');
}


/**
 * Generate planning list
 */
function generatePlanning(item) {

  if (!Array.isArray(item.planning) || item.planning.length === 0) {

    return `
      <ul class="space-y-4">

        <li class="flex items-start gap-3">
          <span class="w-2 h-2 rounded-full bg-gold mt-2 shrink-0"></span>

          <p class="text-ink">
            <span class="font-semibold">Best time</span>
            — Late afternoon is usually a comfortable time to visit.
          </p>
        </li>

        <li class="flex items-start gap-3">
          <span class="w-2 h-2 rounded-full bg-gold mt-2 shrink-0"></span>

          <p class="text-ink">
            <span class="font-semibold">Time on site</span>
            — Most visitors spend around 30–60 minutes.
          </p>
        </li>

      </ul>
    `;
  }


  return `
    <ul class="space-y-4">

      ${item.planning.map(plan => `
        <li class="flex items-start gap-3">

          <span class="w-2 h-2 rounded-full bg-gold mt-2 shrink-0"></span>

          <p class="text-ink">
            <span class="font-semibold">
              ${plan.title}
            </span>

            ${plan.description ? ` — ${plan.description}` : ''}
          </p>

        </li>
      `).join('')}

    </ul>
  `;
}


loadDetail();