const { createClient } = supabase;
const supabaseClient = createClient(
  "https://ecralodmvqsbxnaspmxr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjcmFsb2RtdnFzYnhuYXNwbXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMzkzNDIsImV4cCI6MjA1NzgxNTM0Mn0.Bey5B5sMQX72i9e6TUn5ycmZiYSgLNEoXhb14cwZYPI"
);

async function loadProducts() {
  const { data, error } = await supabaseClient.from("products").select("*");
  if (error) {
    console.error("Помилка:", error);
    return;
  }

  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";
  data.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
            <img src="${product.image_url}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Ціна: ${product.price}</p>
            <p>Продавець: @${product.seller_username}</p>
            <a href="https://t.me/${product.seller_username}" target="_blank">Купити</a>
        `;
    productsDiv.appendChild(productDiv);
  });
}

// Фільтри та пошук
document
  .getElementById("categoryFilter")
  .addEventListener("change", loadProductsWithFilters);
document
  .getElementById("search")
  .addEventListener("input", loadProductsWithFilters);

async function loadProductsWithFilters() {
  const category = document.getElementById("categoryFilter").value;
  const search = document.getElementById("search").value.toLowerCase();

  let query = supabaseClient.from("products").select("*");
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) {
    console.error("Помилка:", error);
    return;
  }

  const filteredData = data.filter(
    (product) =>
      product.title.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
  );

  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";
  filteredData.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
            <img src="${product.image_url}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Ціна: ${product.price}</p>
            <p>Продавець: @${product.seller_username}</p>
            <a href="https://t.me/${product.seller_username}" target="_blank">Купити</a>
        `;
    productsDiv.appendChild(productDiv);
  });
}

// Завантажуємо товари при старті
loadProducts();
