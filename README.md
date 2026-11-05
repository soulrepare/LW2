# Лабораторна робота 2. npm, Sass, Node.js

- **Студент:** Терпак
- **Репозиторій:** [soulrepare/LW2](https://github.com/soulrepare/LW2)
- **GitHub Pages:** https://soulrepare.github.io/LW2/

---

## Версії середовища

- **Node.js:** v20.x (LTS)
- **npm:** 10.x

---

## Команди для збирання

```bash
# Встановлення залежностей
npm install

# Повне збирання проєкту (генерація карток + компіляція стилів)
npm run build
```

### Додаткові скрипти

- `npm run scss:build` — компіляція SCSS у стиснутий файл `css/style.css`
- `npm run scss:watch` — компіляція SCSS у режимі відстеження змін
- `npm run build:cards` — генерація карток товарів із `data/products.json` в `index.html`

---

## Структура проєкту

```text
LW2/
├── index.html               # Головна сторінка з маркерами карток
├── package.json             # Конфігурація проєкту та скрипти
├── package-lock.json        # Фіксація версій залежностей
├── .gitignore               # Ігнорування node_modules/
├── css/
│   └── style.css            # Зкомпільовані стилі
├── src/
│   └── scss/
│       ├── main.scss        # Головний файл стилів (@use)
│       ├── _variables.scss  # Змінні та міксин
│       └── _components.scss # Стилі компонентів
├── data/
│   └── products.json        # Дані карток (8 товарів)
└── scripts/
    └── build-cards.js       # Скрипт генерації розмітки
```

---

## Модульна система

У скрипті `build-cards.js` обрано **CommonJS** (`require`), оскільки вона підтримується Node.js за замовчуванням і не потребує додаткових конфігурацій у проєкті.
