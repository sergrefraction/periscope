# Periscope

Этот репозиторий содержит исходный код для проекта Periscope.

## Сохранение токена в секретах GitHub

1. Перейдите в "Settings" вашего репозитория.
2. Выберите "Secrets and variables" > "Actions".
3. Нажмите "New repository secret".
4. Введите имя секрета (`LOGIC_GAME_TABLE`) и вставьте ваш токен.
5. Нажмите "Add secret".

## Установка GitHub Actions

1. Создайте папку `.github/workflows` в корне репозитория.
2. Создайте файл `deploy.yml` в этой папке.
3. Добавьте в файл следующий YAML-код:

```yaml name=".github/workflows/deploy.yml"
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.LOGIC_GAME_TABLE }}
          publish_dir: ./public
```

## Безопасное хранение токена

После настройки секретов и GitHub Actions вы можете удалить токен из буфера обмена. 
Рекомендуется сохранить токен в безопасном месте, таком как менеджер паролей или защищенный 
файл на вашем компьютере. Токен может понадобиться в будущем для обновления секретов, 
локальной работы с репозиторием или настройки новых репозиториев.

### Сохранение токена в связке ключей на macOS

1. **Скопируйте ваш токен в буфер обмена**.
2. **Откройте Терминал**.
3. **Введите команду для сохранения токена в связке ключей**:
   ```sh
   git credential-osxkeychain store
   ```
4. **Введите данные для аутентификации**:
   ```
   protocol=https
   host=github.com
   username=your-username
   password=your-token
   ```

### Проверка сохранения токена

1. **Откройте Терминал**.
2. **Введите команду для извлечения учетных данных**:
   ```sh
   git credential-osxkeychain get
   ```
3. **Введите данные для запроса**:
   ```
   protocol=https
   host=github.com
   ```
4. **Проверьте вывод**:
   - Если учетные данные были успешно сохранены, вы увидите вывод, содержащий ваше имя 
пользователя и токен.

## Лицензия

Этот проект лицензирован по лицензии MIT.
