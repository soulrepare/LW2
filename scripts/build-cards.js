/**
 * scripts/build-cards.js
 * Лабораторна робота 2.
 * Скрипт зчитує дані з data/products.json і генерує картки товарів у index.html
 * між маркерами <!-- cards:start --> та <!-- cards:end -->.
 */

const fs   = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'products.json');
const PAGE_PATH = path.join(ROOT, 'index.html');

const START_MARKER = '<!-- cards:start -->';
const END_MARKER   = '<!-- cards:end -->';

/**
 * Читає та парсить JSON-файл з обробкою помилок без виведення стека Node.js
 */
function readProducts(filePath) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`[build-cards] Помилка: не знайдено або не вдалося прочитати файл "${filePath}"`);
    process.exit(1);
  }

  try {
    const products = JSON.parse(raw);
    if (!Array.isArray(products)) {
      console.error(`[build-cards] Помилка: вміст файлу "${filePath}" має бути масивом об'єктів`);
      process.exit(1);
    }
    return products;
  } catch (err) {
    console.error(`[build-cards] Помилка: пошкоджений або некоректний JSON у файлі "${filePath}" (${err.message})`);
    process.exit(1);
  }
}

/**
 * Формує HTML-розмітку для однієї картки товару
 */
function renderCard(product) {
  const priceFormatted    = typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : `$${product.price}`;
  const oldPriceFormatted = product.oldPrice ? `$${Number(product.oldPrice).toFixed(2)}` : '';
  const oldPriceHtml      = oldPriceFormatted ? ` <s class="product-card__old">${oldPriceFormatted}</s>` : '';
  const imgWidth          = product.imageWidth || 220;
  const imgHeight         = product.imageHeight || 150;
  const altText           = product.alt || product.title;

  return `          <article class="product-card">
            <div class="product-card__media">
              <img src="${product.image}" width="${imgWidth}" height="${imgHeight}" loading="lazy" alt="${altText}">
              <button class="product-card__add" type="button" aria-label="Add ${product.title} to cart"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
            </div>
            <h3 class="product-card__title">${product.title}</h3>
            <p class="product-card__price"><span>${priceFormatted}</span>${oldPriceHtml}</p>
          </article>`;
}

/**
 * Вставляє згенеровану розмітку в index.html між маркерами <!-- cards:start --> та <!-- cards:end -->
 */
function inject(html, markup) {
  const startIdx = html.indexOf(START_MARKER);
  const endIdx   = html.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.error(`[build-cards] Помилка: не знайдено обов'язкові маркери у файлі index.html`);
    console.error(`  Очікувались: "${START_MARKER}" та "${END_MARKER}"`);
    process.exit(1);
  }

  const before = html.slice(0, startIdx + START_MARKER.length);
  const after  = html.slice(endIdx);

  return `${before}\n${markup}\n        ${after}`;
}

// ── Основний цикл виконання ──────────────────────────────────────────
const products = readProducts(DATA_PATH);
const markup   = products.map(renderCard).join('\n\n');

let htmlContent;
try {
  htmlContent = fs.readFileSync(PAGE_PATH, 'utf-8');
} catch (err) {
  console.error(`[build-cards] Помилка: не вдалося відкрити "${PAGE_PATH}"`);
  process.exit(1);
}

const updatedHtml = inject(htmlContent, markup);

try {
  fs.writeFileSync(PAGE_PATH, updatedHtml, 'utf-8');
} catch (err) {
  console.error(`[build-cards] Помилка запису у "${PAGE_PATH}": ${err.message}`);
  process.exit(1);
}

console.log(`Згенеровано карток: ${products.length}`);
