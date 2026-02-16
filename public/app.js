const container = document.getElementById('product')
fetch('/api/product').then(r=>r.json()).then(list=>{
  list.forEach((p,i)=>{
    const wrapper = document.createElement('div')
    wrapper.className = 'product-card fade-in'
    wrapper.innerHTML = `
      <img class="product-img" src="${p.image}" alt="${p.name}">
      <div class="product-body">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.description} · ${p.city}</p>
        <div class="product-meta">
          <div class="d-flex align-items-center gap-2"><span class="rating">${'★'.repeat(p.rating)}</span><small class="text-muted ms-2">(${p.rating})</small></div>
          <div class="badge-price">€${p.price}</div>
        </div>
        <div class="amenities mt-3">
          ${p.amenities.map(a=>`<span class="amenity">${a}</span>`).join('')}
        </div>
      </div>
    `
    container.appendChild(wrapper)
  })
})
