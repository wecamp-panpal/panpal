# PanPal

## 1. Overview

PanPal allows users to browse, view details, and add recipes. It supports search and filtering to improve discoverability. Initial data will come from mock JSON, with new recipes stored locally.

---

## 2. Core Features

### 2.1 Recipe List Page - Khue

**User Story:**

As a user, I want to see a list of recipes so that I can choose one to view in detail.

**Acceptance Criteria:**

- [ ]  Displays all recipes from mock data.
- [ ]  Each recipe card shows:
    - Title
    - Short description
    - Cooking time
    - Author
- [ ]  Clicking a recipe navigates to its **Recipe Detail Page**.

---

### 2.2 Recipe Detail Page - Khue

**User Story:**

As a user, I want to see the full details of a recipe so that I can cook it step by step.

**Acceptance Criteria:**

- [ ]  Displays recipe title, description, author, and category.
- [ ]  Shows a list of ingredients.
- [ ]  Shows step-by-step cooking instructions.
- Rating
- Comment 
- Favorite Button


---

### 2.3 Add Recipe Page - Quynh Anh && Lam

**User Story:**

As a user, I want to add my own recipes so that I can save and view them later.

**Acceptance Criteria:**

- [ ]  A form is provided with the following fields:
    - Title (text)
    - Description (textarea)
    - Cooking time (number or text)
    - Category (dropdown: Appetizer, Dessert, Main Dish,Side Dish, Soup, Sauce, Drink, Salad)
    - Ingredients (dynamic list input)
    - Steps (dynamic list input): image, instruction
- [ ]  Submitting the form saves the recipe in **local state** (and optionally **localStorage**).
- [ ]  Newly added recipes appear in the **Recipe List Page**.

---

### 2.4 Search & Filter - Khue

**User Story:**

As a user, I want to search and filter recipes so that I can quickly find what I need.

**Acceptance Criteria:**

- [ ]  Search bar allows searching by **recipe title**.
- [ ]  Filter option allows filtering by **category** (Dessert, Main Dish, Drink).
- [ ]  Search and filter can be used together.

---
### 2.5 Authentication - Minh Vo

---

### 2.6 Profile User Button - Tu

#### Favorite 

#### Edit Profile

#### Edit Recipe Post

---
### 2.7 Home Page - Tu && Quynh Anh

#### After login page
###  Landing Page

---



## 3. Future Scope (Optional Features)

- Favorite recipes (bookmark for later).
- Random Recipe
- Edit or delete existing recipes.
- Pagination / infinite scroll on Recipe List.
- Dark mode support.


## 4. Team Members

1. Trần Đồng Trúc Lam 
2. Võ Thị Hồng Minh 
3. Võ Lê Việt Tú
4. Hoàng Thị Minh Khuê
5. Hoàng Ngọc Quỳnh Anh
6. Phạm Ngọc Diễm (Advisor)
