let recipes = JSON.parse(localStorage.getItem("recipes")) || [
  {
    id: 1,
    name: "Baked Ziti",
    image:
      "https://th.bing.com/th/id/OIP._DQXeM7nM4a0Tz9l9-ZEkQHaF7?rs=1&pid=ImgDetMain",
    prepTime: "45 mins",
    reviews: 4.5,
    description:
      "This baked ziti is always a hit! A lady I worked with brought this in one day, and everyone loved it. Now it is the favorite of all my dinner guests. I have made this also without the meat, and it is well received.",
    ingredients: [
      "pound dry ziti pasta",
      "onion, chopped",
      "ounces provolone cheese",
      "½ cups sour cream",
    ],
    instructions: "1. Boil pasta...\n2. Mix eggs and cheese...",
  },
];

function isAdmin() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user && user.role === "admin";
}

function displayRecipes() {
  const recipesGrid = document.getElementById("recipes-grid");
  const adminControls = document.getElementById("admin-controls");
  recipesGrid.innerHTML = "";

  if (isAdmin()) {
    adminControls.style.display = "block";
  }

  recipes.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    recipesGrid.appendChild(card);
  });
}

function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.onclick = (e) => {
    if (!e.target.closest(".admin-buttons")) {
      showRecipeDetails(recipe);
    }
  };

  let adminButtons = "";
  if (isAdmin()) {
    adminButtons = `
            <div class="admin-buttons">
                <button class="edit-btn" onclick="editRecipe(${recipe.id})">Edit</button>
                <button class="delete-btn" onclick="deleteRecipe(${recipe.id})">Delete</button>
            </div>
        `;
  }

  card.innerHTML = `
        ${adminButtons}
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
        <div class="recipe-info">
            <h3>${recipe.name}</h3>
            <div class="recipe-meta">
                <p>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                    ${recipe.prepTime}
                </p>
            </div>
        </div>
    `;

  return card;
}

function showAddRecipeForm() {
  const popup = document.getElementById("recipe-form-popup");
  const form = document.getElementById("recipe-form");
  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("form-submit-btn");

  formTitle.textContent = "Add New Recipe";
  submitBtn.textContent = "Add Recipe";
  form.reset();
  form.removeAttribute("data-recipe-id");

  popup.style.display = "block";
}

function editRecipe(recipeId) {
  const recipe = recipes.find((r) => r.id === recipeId);
  if (!recipe) return;

  const popup = document.getElementById("recipe-form-popup");
  const form = document.getElementById("recipe-form");
  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("form-submit-btn");

  document.getElementById("recipe-name").value = recipe.name;
  document.getElementById("recipe-image").value = recipe.image;
  document.getElementById("recipe-prep-time").value = recipe.prepTime;
  document.getElementById("recipe-description").value = recipe.description;
  document.getElementById("recipe-ingredients").value =
    recipe.ingredients.join("\n");
  document.getElementById("recipe-instructions").value = recipe.instructions;

  formTitle.textContent = "Edit Recipe";
  submitBtn.textContent = "Update Recipe";
  form.setAttribute("data-recipe-id", recipeId);

  popup.style.display = "block";
}

function deleteRecipe(recipeId) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    recipes = recipes.filter((recipe) => recipe.id !== recipeId);
    saveRecipes();
    displayRecipes();
  }
}

function handleRecipeSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const recipeId = form.getAttribute("data-recipe-id");
  const recipeData = {
    name: document.getElementById("recipe-name").value,
    image: document.getElementById("recipe-image").value,
    prepTime: document.getElementById("recipe-prep-time").value,
    description: document.getElementById("recipe-description").value,
    ingredients: document
      .getElementById("recipe-ingredients")
      .value.split("\n")
      .filter((i) => i.trim()),
    instructions: document.getElementById("recipe-instructions").value,
  };

  if (recipeId) {
    recipeData.id = parseInt(recipeId);
    const index = recipes.findIndex((r) => r.id === parseInt(recipeId));
    recipes[index] = recipeData;
  } else {
    recipeData.id =
      recipes.length > 0 ? Math.max(...recipes.map((r) => r.id)) + 1 : 1;
    recipes.push(recipeData);
  }

  saveRecipes();
  closeFormPopup();
  displayRecipes();
}

function saveRecipes() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

function closeFormPopup() {
  document.getElementById("recipe-form-popup").style.display = "none";
  document.getElementById("recipe-form").reset();
}

function showRecipeDetails(recipe) {
  const popup = document.getElementById("recipe-popup");
  const details = document.getElementById("popup-details");

  details.innerHTML = `
        <h2>${recipe.name}</h2>
        <img src="${recipe.image}" alt="${
    recipe.name
  }" style="max-width: 100%;">
        <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
        <p><strong>Description:</strong> ${recipe.description}</p>
        <h3>Ingredients:</h3>
        <ul>${recipe.ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>
        <h3>Instructions:</h3>
        <p>${recipe.instructions}</p>
    `;

  popup.style.display = "block";
}

function closePopup() {
  document.getElementById("recipe-popup").style.display = "none";
}

function checkAuth() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    window.location.href = "index.html";
  }
  return user;
}

const user = checkAuth();
displayRecipes();
