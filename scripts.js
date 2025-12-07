class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title =
      this.querySelector("h2, h3")?.textContent || "Untitled Project";
    const picture = this.querySelector("picture");
    const description = this.querySelector("p:not(.meta)")?.innerHTML || "";
    const link = this.querySelector("a");
    const meta = this.querySelector(".meta")?.textContent || "";
    const tags = this.getAttribute("tags") || "";
    const date = this.getAttribute("date") || "";

    const pictureHTML = picture
      ? picture.outerHTML
      : '<img src="" alt="Project placeholder" />';
    const linkHTML = link
      ? `<a href="${link.href}" target="_blank" rel="noopener noreferrer" class="cta-link">${link.textContent}</a>`
      : "";
    const tagsHTML = tags
      ? `<div class="tags">${tags
          .split(",")
          .map((tag) => `<span class="tag">${tag.trim()}</span>`)
          .join("")}</div>`
      : "";
    const dateHTML = date
      ? `<time datetime="${date}" class="date">${date}</time>`
      : "";
    const metaHTML = meta ? `<p class="meta">${meta}</p>` : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --card-bg: #f8fafc;
          --card-border: #e2e8f0;
          --card-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.02);
          --card-hover-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.03);
          --card-accent: #0f172a;
          --card-text: #334155;
          --card-meta-text: #64748b;
          --tag-bg: #f1f5f9;
          --tag-text: #475569;

          display: flex;
          flex-direction: column;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 1.5rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          height: 100%;
        }

        :host(:hover) {
          box-shadow: var(--card-hover-shadow);
          border-color: #cbd5e1;
        }

        h2 {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--card-accent);
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }

        picture, img {
          display: block;
          width: 100%;
          margin: 1.25rem 0;
          border-radius: 6px;
          overflow: hidden;
        }

        picture img, img {
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 6px;
        }

        picture:hover img, img:hover {
          transform: scale(1.02);
        }

        p {
          color: var(--card-text);
          line-height: 1.7;
          margin: 0.75rem 0;
          font-size: 0.9375rem;
        }

        .meta {
          font-size: 0.875rem;
          color: var(--card-meta-text);
          font-style: italic;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--card-border);
        }

        .date {
          display: inline-block;
          font-size: 0.8125rem;
          color: var(--card-meta-text);
          margin-bottom: 0.75rem;
          font-weight: 500;
          background: var(--tag-bg);
          padding: 0.25rem 0.625rem;
          border-radius: 4px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .tag {
          background: var(--tag-bg);
          color: var(--tag-text);
          padding: 0.375rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 500;
          border: 1px solid var(--card-border);
        }

        .cta-link {
          display: inline-block;
          margin-top: 1.25rem;
          padding: 0.5rem 1rem;
          background: var(--card-accent);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.9375rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
        }

        .cta-link:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          :host {
            padding: 1.25rem;
          }

          h2 {
            font-size: 1.25rem;
          }

          picture, img {
            margin: 1rem 0;
          }
        }
      </style>

      <article>
        ${dateHTML}
        <h2>${title}</h2>
        ${pictureHTML}
        ${tagsHTML}
        <p>${description}</p>
        ${linkHTML}
        ${metaHTML}
      </article>
    `;
  }
}

customElements.define("project-card", ProjectCard);

document.addEventListener("DOMContentLoaded", () => {
  // THEME TOGGLE
  const themeToggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (themeToggleBtn) themeToggleBtn.textContent = "🌙 Dark mode";
    } else {
      root.setAttribute("data-theme", "light");
      if (themeToggleBtn) themeToggleBtn.textContent = "☀ Light mode";
    }
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  applyTheme(initialTheme);
  localStorage.setItem("theme", initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.hidden = false;

    themeToggleBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }

  const menuCheckbox = document.getElementById("menu-checkbox");
  const menuIcon = document.querySelector(".menu-icon");

  if (menuCheckbox && menuIcon) {
    menuIcon.addEventListener("click", () => {
      menuCheckbox.checked = !menuCheckbox.checked;
    });
  }

  if ("startViewTransition" in document) {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-view-transition]");
      if (!link) return;

      if (
        link.target === "_blank" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      const url = link.href;

      document.startViewTransition(() => {
        window.location.href = url;
      });
    });
  }
});
