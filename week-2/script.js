document.addEventListener("DOMContentLoaded", function () {

  // ================= DROPDOWN TOGGLES =================
  function setupDropdown(toggleId, menuId) {
    const toggle = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);
    if (!toggle || !menu) return;

    toggle.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent closing immediately
      menu.classList.toggle("hidden");
    });

    // close when clicking outside
    document.addEventListener("click", () => menu.classList.add("hidden"));

    // prevent closing when clicking inside
    menu.addEventListener("click", (e) => e.stopPropagation());
  }

  setupDropdown("all-categories-toggle", "all-categories-menu");
  setupDropdown("help-toggle", "help-menu");
  setupDropdown("lang-currency-toggle", "lang-currency-menu");
  setupDropdown("shipping-toggle", "shipping-menu");

  // ================= PRODUCTS =================
  const products = [
    { id:1, name:"Canon EOS 2000 Camera", brand:"Canon", price:998, verified:true, image:"assets/Image/tech/image 23.png"},
    { id:2, name:"GoPro HERO6 4K Action Camera", brand:"GoPro", price:850, verified:true, image:"assets/Image/tech/6.png"},
    { id:3, name:"Samsung Galaxy Phone", brand:"Samsung", price:650, verified:false, image:"assets/Image/tech/image 33.png"},
    { id:4, name:"Apple iPhone 13", brand:"Apple", price:1200, verified:true, image:"assets/Image/tech/image 29.png"},
    { id:5, name:"Huawei P40", brand:"Huawei", price:500, verified:false, image:"assets/Image/tech/8.png"},
    { id:6, name:"Canon Professional Lens", brand:"Canon", price:400, verified:true, image:"assets/Image/tech/image 86.png"},
    { id:7, name:"GoPro HERO 5", brand:"GoPro", price:300, verified:false, image:"assets/Image/tech/image 34.png"},
    { id:8, name:"Samsung Smart Watch", brand:"Samsung", price:250, verified:true, image:"assets/Image/tech/7.png"},
    { id:9, name:"Apple AirPods", brand:"Apple", price:199, verified:true, image:"assets/Image/tech/image 85.png"},
    { id:10, name:"Huawei Tablet", brand:"Huawei", price:350, verified:false, image:"assets/Image/tech/image 98.png"}
  ];

  let currentPage = 1;
  const perPage = 4;
  let viewMode = "grid";
  const container = document.getElementById("productContainer");
  const totalCount = document.getElementById("totalCount");
  const pagination = document.getElementById("pagination");

  // ================= RENDER PRODUCTS =================
  function renderProducts(data){
    if(!container) return;
    container.innerHTML = "";
    container.className = viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6";

    if(data.length === 0){
      container.innerHTML = "<p class='text-center text-gray-500'>No products found</p>";
      return;
    }

    let start = (currentPage - 1) * perPage;
    let paginated = data.slice(start, start + perPage);

    paginated.forEach(product => {
      if(viewMode === "grid"){
        container.innerHTML += `
        <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <img src="${product.image}" class="h-32 mx-auto object-contain">
          <h3 class="font-semibold mt-4 text-center">${product.name}</h3>
          <p class="text-xl font-bold text-center mt-2">$${product.price}</p>
          <p class="text-center text-sm mt-1 ${product.verified ? 'text-green-600':'text-gray-500'}">
            ${product.verified ? "Verified Supplier" : "Not Verified"}
          </p>
        </div>`;
      } else {
        container.innerHTML += `
        <div class="bg-white p-6 rounded-2xl shadow flex gap-6 items-center">
          <img src="${product.image}" class="w-32 h-32 object-contain">
          <div class="flex-1">
            <h3 class="font-semibold text-lg">${product.name}</h3>
            <p class="text-xl font-bold mt-2">$${product.price}</p>
            <p class="text-sm ${product.verified ? 'text-green-600':'text-gray-500'}">
              ${product.verified ? "Verified Supplier" : "Not Verified"}
            </p>
          </div>
        </div>`;
      }
    });

    if(totalCount) totalCount.innerText = data.length;
    renderPagination(data.length);
  }

  // ================= PAGINATION =================
  function renderPagination(total){
    if(!pagination) return;
    pagination.innerHTML = "";
    let pages = Math.ceil(total / perPage);
    for(let i=1;i<=pages;i++){
      pagination.innerHTML += `
        <button class="px-4 py-2 border rounded ${i===currentPage ? 'bg-blue-600 text-white':''}" onclick="goToPage(${i})">${i}</button>`;
    }
  }

  window.goToPage = function(page){
    currentPage = page;
    applyFilters();
  }

  // ================= FILTERS =================
  function applyFilters(){
    let selectedBrands = Array.from(document.querySelectorAll(".brand:checked")).map(b=>b.value);
    let min = document.getElementById("minPrice")?.value;
    let max = document.getElementById("maxPrice")?.value;
    let verifiedOnly = document.getElementById("verifiedOnly")?.checked;
    let sort = document.getElementById("sortSelect")?.value;

    let filtered = products.filter(p => {
      if(selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if(min && p.price < parseFloat(min)) return false;
      if(max && p.price > parseFloat(max)) return false;
      if(verifiedOnly && !p.verified) return false;
      return true;
    });

    if(sort === "low") filtered.sort((a,b)=>a.price-b.price);
    if(sort === "high") filtered.sort((a,b)=>b.price-a.price);

    renderProducts(filtered);
  }

  // ================= EVENT LISTENERS =================
  document.querySelectorAll(".brand").forEach(cb=>{
    cb.addEventListener("change", ()=>{ currentPage = 1; applyFilters(); });
  });
  document.getElementById("applyPrice")?.addEventListener("click", ()=>{ currentPage = 1; applyFilters(); });
  document.getElementById("verifiedOnly")?.addEventListener("change", ()=>{ currentPage = 1; applyFilters(); });
  document.getElementById("sortSelect")?.addEventListener("change", ()=>{ currentPage = 1; applyFilters(); });

  document.getElementById("gridView")?.addEventListener("click", ()=>{
    viewMode = "grid"; currentPage = 1; applyFilters();
  });
  document.getElementById("listView")?.addEventListener("click", ()=>{
    viewMode = "list"; currentPage = 1; applyFilters();
  });

  applyFilters();
});
