import ffetch from '../../scripts/ffetch.js';
import { createElementWithClasses } from '../../scripts/utils.js';

async function getItems() {
  const path = window.location.pathname;
  // get the breadcrumb items from the page path, only after '/us/en'
  const pathParts = path.split('/');
  const itemPaths = pathParts.length > 2 ? pathParts.slice(3).map((_, i) => pathParts.slice(0, i + 4).join('/')) : [];
  const articles = await ffetch('/au/en/query-index.json')
    .filter((article) => itemPaths.includes(article.path))
    .all();

  // map over itemPaths to create items
  return itemPaths.map((itemPath) => {
    // get the title from the article, based on its path
    const article = articles.find((entry) => entry.path === itemPath);
    let title = article && article.navTitle !== '' ? article.navTitle : itemPath.split('/').pop();
    title = title.charAt(0).toUpperCase() + title.slice(1);
    return {
      title,
      href: `${itemPath}.html`,
    };
  });
}
export default async function decorate(block) {
  const items = await getItems();
  block.innerHTML = '';
  const ol = createElementWithClasses('ol');
  ol.append(
    ...items.map((item) => {
      const li = createElementWithClasses('li');
      if (item['aria-current']) {
        li.classList.add('active');
        li.setAttribute('aria-current', item['aria-current']);
      }
      if (item.url) {
        const a = createElementWithClasses('a');
        a.href = item.url;
        a.textContent = item.title;
        li.append(a);
      } else {
        li.textContent = item.title;
      }
      return li;
    }),
  );

  block.append(ol);
}
