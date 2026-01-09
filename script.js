const blogPosts = [
  {
    id: 1,
    title: "欢迎来到我的个人博客",
    date: "2026-01-01",
    category: "生活随笔",
    excerpt: "这是我的第一篇博客文章，简单记录一下创建博客的初衷和未来的规划。",
  },
  {
    id: 2,
    title: "前端学习路线分享",
    date: "2026-01-03",
    category: "技术分享",
    excerpt:
      "整理了一条适合自学前端的路线，从 HTML/CSS/JavaScript 到框架和工程化工具。",
  },
  {
    id: 3,
    title: "最近在看的书和感想",
    date: "2026-01-05",
    category: "阅读笔记",
    excerpt:
      "分享几本最近读过印象比较深刻的书，以及其中对我有启发的一些观点。",
  },
  {
    id: 4,
    title: "打造高效的个人工作流",
    date: "2026-01-07",
    category: "效率提升",
    excerpt:
      "记录自己在时间管理、任务拆分以及工具使用方面的一些实践经验。",
  },
];

const themeStorageKey = "simple-blog-theme";

function renderFooterYear() {
  const footerYearElement = document.getElementById("footer-year");
  if (!footerYearElement) {
    return;
  }
  const currentYear = new Date().getFullYear();
  footerYearElement.textContent = String(currentYear);
}

function getUniqueCategories(posts) {
  const categorySet = new Set();
  posts.forEach((post) => {
    if (post.category) {
      categorySet.add(post.category);
    }
  });
  return Array.from(categorySet);
}

function renderCategories(posts) {
  const categoryListElement = document.getElementById("category-list");
  if (!categoryListElement) {
    return;
  }

  const categories = getUniqueCategories(posts);
  categoryListElement.innerHTML = "";

  const allCategoryItem = document.createElement("li");
  allCategoryItem.textContent = "全部";
  allCategoryItem.className = "category-item active";
  allCategoryItem.dataset.category = "all";
  categoryListElement.appendChild(allCategoryItem);

  categories.forEach((categoryName) => {
    const categoryItem = document.createElement("li");
    categoryItem.textContent = categoryName;
    categoryItem.className = "category-item";
    categoryItem.dataset.category = categoryName;
    categoryListElement.appendChild(categoryItem);
  });
}

function renderPosts(posts) {
  const postListElement = document.getElementById("post-list");
  if (!postListElement) {
    return;
  }

  postListElement.innerHTML = "";

  if (!posts.length) {
    const emptyElement = document.createElement("p");
    emptyElement.textContent = "没有找到匹配的文章。";
    postListElement.appendChild(emptyElement);
    return;
  }

  posts.forEach((post) => {
    const cardElement = document.createElement("article");
    cardElement.className = "post-card";

    const titleElement = document.createElement("h3");
    titleElement.className = "post-title";
    titleElement.textContent = post.title;

    const metaElement = document.createElement("p");
    metaElement.className = "post-meta";
    metaElement.textContent = `${post.date} · ${post.category}`;

    const excerptElement = document.createElement("p");
    excerptElement.className = "post-excerpt";
    excerptElement.textContent = post.excerpt;

    cardElement.appendChild(titleElement);
    cardElement.appendChild(metaElement);
    cardElement.appendChild(excerptElement);

    postListElement.appendChild(cardElement);
  });
}

function attachSearchHandler() {
  const searchInputElement = document.getElementById("search-input");
  if (!searchInputElement) {
    return;
  }

  const filterAndRenderPosts = () => {
    const searchKeyword = searchInputElement.value.trim().toLowerCase();
    const selectedCategoryElement = document.querySelector(
      ".category-item.active"
    );
    const selectedCategory =
      selectedCategoryElement?.dataset.category ?? "all";

    const filteredPosts = blogPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchesKeyword =
        !searchKeyword ||
        post.title.toLowerCase().includes(searchKeyword) ||
        post.excerpt.toLowerCase().includes(searchKeyword);
      return matchesCategory && matchesKeyword;
    });

    renderPosts(filteredPosts);
  };

  searchInputElement.addEventListener("input", filterAndRenderPosts);

  const categoryListElement = document.getElementById("category-list");
  if (categoryListElement) {
    categoryListElement.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const category = target.dataset.category;
      if (!category) {
        return;
      }

      document
        .querySelectorAll(".category-item")
        .forEach((categoryElement) => {
          categoryElement.classList.remove("active");
        });

      target.classList.add("active");

      filterAndRenderPosts();
    });
  }
}

function applyStoredThemePreference() {
  const storedTheme = window.localStorage.getItem(themeStorageKey);
  if (storedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

function attachThemeToggleHandler() {
  const themeToggleButton = document.getElementById("theme-toggle");
  if (!themeToggleButton) {
    return;
  }

  const updateButtonLabel = () => {
    const isDark = document.body.classList.contains("dark");
    themeToggleButton.textContent = isDark ? "切换浅色模式" : "切换深色模式";
  };

  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    window.localStorage.setItem(themeStorageKey, isDark ? "dark" : "light");
    updateButtonLabel();
  });

  updateButtonLabel();
}

function attachNavHandlers() {
  const navButtons = document.querySelectorAll(".nav-link");
  if (!navButtons.length) {
    return;
  }

  const sections = {
    home: document.getElementById("section-home"),
    about: document.getElementById("section-about"),
    contact: document.getElementById("section-contact"),
  };

  navButtons.forEach((buttonElement) => {
    const sectionKey = buttonElement.getAttribute("data-section");
    if (!sectionKey) {
      return;
    }

    buttonElement.addEventListener("click", () => {
      Object.keys(sections).forEach((key) => {
        const sectionElement = sections[key];
        if (!sectionElement) {
          return;
        }
        if (key === sectionKey) {
          sectionElement.classList.remove("hidden");
        } else {
          sectionElement.classList.add("hidden");
        }
      });
    });
  });
}

function initializeBlogPage() {
  renderFooterYear();
  renderCategories(blogPosts);
  renderPosts(blogPosts);
  attachSearchHandler();
  applyStoredThemePreference();
  attachThemeToggleHandler();
  attachNavHandlers();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBlogPage);
} else {
  initializeBlogPage();
}

