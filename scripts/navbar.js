fetch("navbar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-placeholder").innerHTML = data;
    const searchContainer = document.getElementById("searchContainer");
    if (searchContainer) {
      searchContainer.style.display = window.location.pathname.includes(
        "dashboard.html"
      )
        ? "flex"
        : "none";
    }
  });

function logout() {
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
}

function searchRecipes() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm)
  );

  const recipesGrid = document.getElementById("recipes-grid");
  recipesGrid.innerHTML = "";

  filteredRecipes.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    recipesGrid.appendChild(card);
  });
}
