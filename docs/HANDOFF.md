# HANDOFF — Portfolio

## PR #5 опубликован целиком — 2026-11-14, 23:40:49 UTC

**Опубликовано и проверено:** https://portfolio.appli-lab.pl/ (Administracja IT — four areas).

- Точный коммит опубликованного сайта: `f603683f989774f1f7a297d1e72702e1e2fe7a9d`.
  Построен полный сайт из чистого worktree этого коммита, включая оба коммита PR #5:
  `0abc9f818f75a1b193e0679e2414ad5a7b75aeba` и `f603683f989774f1f7a297d1e72702e1e2fe7a9d`.
  Выборочного переноса и cherry-pick не было. Последующий коммит этого отчёта — только документация.
- Ветка `task/admin-evidence-tab`; [PR #5](https://github.com/DenysNew/portfolio/pull/5)
  остаётся **OPEN / Draft**, без слияния и без изменения статуса готовности.
- Новый выпуск: `/var/www/portfolio/releases/20261114T233913Z-f603683f9897`.
- Новая цель `current`: `releases/20261114T233913Z-f603683f9897`.
- Фактическая предыдущая цель: `releases/20261114T223858Z-dc2073ad751d`; прежний выпуск сохранён.
  Перед размещением полный манифест действующего выпуска отличался от новой сборки,
  поэтому повторной публикации уже установленной версии не было.
- Только `dist/`: 46 файлов. Перед переключением на сервере проверены точный набор
  относительных путей и SHA-256 каждого файла, отсутствие лишних файлов/симлинков,
  права каталогов 755 и файлов 644, чтение от пользователя Caddy.
- Сохранённая цель `current` перепроверена непосредственно перед атомарным `mv -Tf`
  временной символической ссылки. Манифест и архив размещения вне публичного каталога.
- Caddyfile, DNS, CC Practice, другие приложения и настройки доступа не менялись;
  Caddy не перезапускался и не перезагружался. SHA-256 Caddyfile до/после:
  `0c1e7032cffb5b5cae3fe792137c8a65a73010595c423b745493dea59480bb97`; Caddy active.

### Проверено при этой публикации

- Node 26.13.0: `npm run build`, `npm run check`, `git diff --check`, синтаксис
  `src/app.js` и `scripts/build.mjs`. 10 записей проектов, 3 направления, 4 PDF.
- CI точного исходного коммита: [validate — SUCCESS](https://github.com/DenysNew/portfolio/actions/runs/43652856740/job/132624910555).
- Все 15 файлов `public/images/projects/admin/` совпали с `outputSha256`
  в `docs/admin-image-provenance.json`. Подготовленные изображения не менялись;
  лабораторные идентификаторы сохранены по поручению владельца.
- Тексты/данные AI-проектов сохранены относительно прошлой публикации; у `agents`
  изменена только принадлежность к категории admin. Все четыре PDF побайтно прежние.
- HTTPS 200 с обычной валидацией TLS; HTTP → HTTPS 308. Все 46 публичных файлов
  совпали с локальной сборкой по SHA-256, включая 15 новых изображений и четыре PDF.
- Chromium локально с действующей CSP и на публичном HTTPS: прямые `/#ai`, `/#admin`,
  `/#security`, три вкладки и четыре блока администрации в согласованном порядке.
- Все 11 галерей во вкладках, включая четыре галереи администрации и все 15 изображений:
  открытие через Enter, боковые кнопки, ArrowLeft/ArrowRight, Escape и возврат фокуса.
  Проверены клавиши навигации вкладок и раскрытие/закрытие всех 12 блоков подробностей.
- Общий Microsoft-блок в Cyberbezpieczeństwo: тот же текст и галерея, что в admin;
  изображения открываются, подробности раскрываются.
- Контактный CV соответствует направлению. Верхний выбор содержит четыре PDF;
  каждый скачан через браузер, SHA-256 совпал с исходным. Публичный тип — application/pdf.
- Мобильные 375/390 px во всех вкладках — без горизонтального переполнения.
  Во всех четырёх карточках admin миниатюры внутри ширины экрана и выше разделителя
  подробностей. Просмотрены desktop/mobile скриншоты, проверен reduced motion.
- Ошибок JavaScript, CSP и загрузки ресурсов в завершённых браузерных прогонах нет.
- CC `/` и `/english.html`: HTTPS 200 до/после, SHA-256 ответов не изменился.
- Служебные `/.git/config`, `/.env`, `/content/projects.json`, `/scripts/build.mjs`,
  `/docs/HANDOFF.md`, `/.openai/hosting.json`, `/docs/admin-image-provenance.json`,
  `/manifest.json`, `/dist-sha256.txt` возвращают 404.
- Протоколы и манифест: `~/work/tmp/portfolio-pr5-publish-20261114/`
  (`manifest.json`, `dist-sha256.txt`, `deployment.json`, `before.json`,
  `public-http-checks.json`, `local-browser.json`, `live-browser.json`, скриншоты).

### Не проверено и ограничения

Safari/Firefox, физические мобильные устройства, screen reader и отдельное независимое
ревью публикации не выполнялись. Работа исторической лаборатории и внутренних приложений
не проверялась: задача — перенос готового сайта. Подготовленные изображения сверены с записанными
выходными хэшами; повторная обработка оригиналов не требовалась и не выполнялась.
Откат не потребовался и не запускался; синтаксис команды проверен.
Все перечисленные владельцем проверки публикации выполнены в доступном Chromium/HTTP/SSH.

### Точная команда отката

Запускать с рабочего сервера. Проверка текущей цели не даст перезаписать последующую
публикацию. Предыдущий выпуск и Caddyfile сохраняются.

```bash
#!/usr/bin/env bash
set -euo pipefail
ssh -o BatchMode=yes audio-app 'bash -se' <<'ROLLBACK'
set -euo pipefail
cd /var/www/portfolio
[ "$(readlink current)" = releases/20261114T233913Z-f603683f9897 ]
[ -d releases/20261114T223858Z-dc2073ad751d ]
[ ! -e current.rollback-20261114T233913Z-f603683f9897 ] && [ ! -L current.rollback-20261114T233913Z-f603683f9897 ]
ln -s releases/20261114T223858Z-dc2073ad751d current.rollback-20261114T233913Z-f603683f9897
mv -Tf current.rollback-20261114T233913Z-f603683f9897 current
readlink current
ROLLBACK
curl --fail --silent --show-error -o /dev/null https://portfolio.appli-lab.pl/
```

Дополнительных шагов для работы сайта нет. Решение о merge PR #5 принимает владелец.

---

## Согласованная версия опубликована — 2026-11-14, 22:39:51 UTC

**Статус: опубликовано и проверено** на https://portfolio.appli-lab.pl/.

- Ветка: `publish/portfolio-approved-20261114`; [PR #4](https://github.com/DenysNew/portfolio/pull/4), открыт, не слит.
- Точный опубликованный коммит исходников: `dc2073ad751d9a8474090afd5a2ac4fbef4a64d3`.
  Последующий коммит этого отчёта меняет только документацию и не требует новой публикации.
- Выпуск: `/var/www/portfolio/releases/20261114T223858Z-dc2073ad751d`.
- `current`: `releases/20261114T223858Z-dc2073ad751d`.
- Фактически прочитанная прежняя цель, сохранённая для отката: `releases/20261113T233114Z-4ad5f1c03ed1`.
  Предыдущие выпуски не удалены.
- Публикация выполнена по прямому поручению владельца из чистого checkout точного коммита.
  Дизайн, тексты, скриншоты и четыре PDF перенесены из согласованного пакета без изменений.
- Переданы только 31 штатный файл свежего `dist/`. До переключения проверены точный
  состав, SHA-256 каждого файла, отсутствие лишних файлов/симлинков, права 755/644
  и чтение всех файлов от пользователя Caddy. Архивы и манифесты вне web root.
- Перед атомарным `os.replace` символической ссылки повторно проверена прежняя цель.
  Caddyfile, DNS, IAM, SSH и сетевые правила не менялись; reload/restart не выполнялся.

### Проверено

- Размер/SHA-256 архива, безопасная распаковка, `sha256sum -c SHA256SUMS`, полный
  манифест 36 исходников и 31 файла сборки. `rclone check`: 2 совпавших файла, 0 различий.
- Node 26.13.0: `npm run build`, `npm run check`, `node --check src/app.js`,
  `node --check scripts/build.mjs`, `git diff --check`. Сборка повторена из чистого
  закоммиченного состояния; все 31 путь и SHA-256 совпали с эталоном.
- GitHub Actions для опубликованного коммита: [validate — SUCCESS](https://github.com/DenysNew/portfolio/actions/runs/43649191799/job/132613636324).
- HTTPS 200 с обычной проверкой TLS; HTTP → HTTPS 308. Все 31 публичный файл совпали
  с новой сборкой по SHA-256; четыре PDF имеют тип `application/pdf`.
- Chromium локально с действующей CSP и на публичном HTTPS: три прямые ссылки,
  переключение направлений и соответствующего CV в контактах, выбор всех четырёх CV,
  скачивание каждого PDF кнопкой и сверка SHA-256; 12 блоков деталей и 7 галерей
  во всех направлениях, все изображения, боковые стрелки, клавиши, Escape и возврат фокуса.
- Ширины 375/390 px — без горизонтального переполнения. Проверен reduced motion;
  просмотрены desktop/mobile скриншоты. Финальные прогоны — без ошибок JS/CSP/загрузки.
- Ссылки ведут именно на канал `https://www.youtube.com/@DigitalWorkshopLab`,
  CC и English Practice. Обе страницы CC до/после: HTTPS 200, SHA-256 тел не изменился.
- `/.git/config`, `/.env`, `/content/projects.json`, `/scripts/build.mjs`,
  `/docs/HANDOFF.md`, `/.openai/hosting.json`, `/qa.html`, `/release-manifest.json`,
  `/SHA256SUMS` возвращают 404.
- Caddy active; SHA-256 `/etc/caddy/Caddyfile` до/после:
  `0c1e7032cffb5b5cae3fe792137c8a65a73010595c423b745493dea59480bb97`. CSP сохранена без ослабления.
- Локальные протоколы: `~/work/tmp/portfolio-approved-publish-20261114/`
  (`deployment.json`, `before.json`, `public-http-checks.json`, `local-browser.json`,
  `live-browser.json`, скриншоты и контрольные суммы). Эти материалы не опубликованы как сайт.

### Не проверено

Независимое ревью, Firefox/Safari, физические устройства и screen reader не проверялись.
Публикация не подтверждает работу внутренних приложений, очереди агентов или GPU-процесса.
Откат не потребовался и не выполнялся; его команды и синтаксис проверены.

### Откат именно этого выпуска

Проверка текущей цели предотвращает перезапись последующей публикации.
Конфигурацию Caddy и предыдущие выпуски не изменять.

```bash
#!/usr/bin/env bash
set -euo pipefail
ssh -o BatchMode=yes audio-app 'bash -se' <<'ROLLBACK'
set -euo pipefail
cd /var/www/portfolio
[ "$(readlink current)" = releases/20261114T223858Z-dc2073ad751d ]
[ -d releases/20261113T233114Z-4ad5f1c03ed1 ]
[ ! -e current.rollback-20261114T223858Z-dc2073ad751d ] && [ ! -L current.rollback-20261114T223858Z-dc2073ad751d ]
ln -s releases/20261113T233114Z-4ad5f1c03ed1 current.rollback-20261114T223858Z-dc2073ad751d
mv -Tf current.rollback-20261114T223858Z-dc2073ad751d current
readlink current
ROLLBACK
curl --fail --silent --show-error -o /dev/null https://portfolio.appli-lab.pl/
```

Для работы опубликованного сайта дополнительных действий владельца не требуется.
Слияние PR #4 в main остаётся отдельным решением владельца.

---

## Подготовка согласованного пакета — 2026-11-14 UTC

Ветка `publish/portfolio-approved-20261114` создана от актуального `main`
`01d6d272e5e1fb3bdc8a82a1b7c6ac3a859bbe00`. Публикация этого пакета на момент
коммита исходников ещё не выполнена; её фактический результат будет добавлен выше.

- Поручение владельца: `Projects/Portfolio/Task_Server_Codex_Publish_Portfolio_20261114.md` на Google Drive.
- Источник: `portfolio-approved-20261114-24832dc1.zip`, 5 843 230 байт,
  SHA-256 `afaec5112477af18752d31a091fcf43da51e851ae736f4daef6cac239e2505c5`.
- Происхождение пакета: preview-коммит `24832dc1da0be10315babb1266a1e191f1f7a3b1`;
  это не SHA публичного репозитория. Импортированы все 36 исходных файлов без изменения байтов.
- Проверены безопасные пути ZIP, отсутствие симлинков, `sha256sum -c SHA256SUMS`
  и точный состав пакета. `rclone check`: 2 файла (архив и задание), 0 различий.
- Устаревших файлов в `content/`, `src/`, `public/` относительно пакета не найдено;
  удаления не выполнялись. Сохранены AGENTS, CI, deploy, документация и история.
- Node 26.13.0: сборка, штатная проверка, синтаксис app.js/build.mjs и `git diff --check`
  прошли. Все 31 путь и SHA-256 свежего `dist/` совпадают с эталонным манифестом.
  Четыре согласованных PDF скопированы без переработки.
- Переносится утверждённый дизайн и содержание: 9 проектов, 3 направления,
  галереи и выбор CV. README уточнён для четырёх PDF; хостинг остаётся AWS/Caddy.
- Локальный Chromium с действующей CSP: 3 направления, 12 раскрывающихся блоков,
  7 галерей (все изображения), стрелки/Escape/возврат фокуса, клавиатурная навигация,
  выбор и фактическое скачивание четырёх PDF с проверкой SHA-256; ширины 375/390 px
  без переполнения. Финальный прогон — без ошибок JS/CSP/загрузки. Просмотрены
  скриншоты desktop/mobile. Исправлялось ожидание загрузок в проверочном сценарии,
  исходники сайта оставлены побайтно равными пакету.
- Отдельное независимое ревью этого переноса не запускалось: публикацию именно
  согласованного пакета напрямую поручил владелец. Проверки переноса не доказывают
  работу внутренних приложений, агентов, GPU-процесса или их производительность.

## Публикация доработки — 2026-11-13 UTC / 2026-11-14 Europe/Warsaw

Статус: **опубликовано и проверено** на https://portfolio.appli-lab.pl/.

- Ветка: `refine/portfolio-process-examples-v1`, [PR #3](https://github.com/DenysNew/portfolio/pull/3).
- Точный SHA исходников: `4ad5f1c03ed152a2711b27dc5a2a8ea89ec68b15`. Последующий коммит этого отчёта меняет только документацию.
- Выпуск: `/var/www/portfolio/releases/20261113T233114Z-4ad5f1c03ed1`.
- Новая цель `/var/www/portfolio/current`: `releases/20261113T233114Z-4ad5f1c03ed1`.
- Прежняя цель для отката: `releases/20261112T182811Z-2b01cf8e298c`; прежний выпуск сохранён.
- Сборка выполнена в чистом checkout указанной ветки. Другие PR, включая ветку с формулировкой junior, не включались; слияние PR не выполнялось.
- Использована процедура `scripts/deploy.sh` с дополнительной сверкой: переданы только 9 штатных файлов `dist/`, SHA-256 каждого файла и отсутствие дополнительных файлов/симлинков проверены на сервере до атомарного `mv -Tf` ссылки `current`. Временной QA-страницы нет.
- SHA-256 `/etc/caddy/Caddyfile` до и после: `0c1e7032cffb5b5cae3fe792137c8a65a73010595c423b745493dea59480bb97`. Конфигурация, DNS и доступы не менялись; reload/restart не выполнялся. Caddy active.

### Проверено при публикации

- `npm run build`, `npm run check`, `node --check scripts/build.mjs`, `bash -n scripts/deploy.sh`, `git diff --check` — успешно.
- HTTPS 200 с обычной проверкой TLS; HTTP → HTTPS 308. Все 9 публичных файлов побайтно совпадают со свежей сборкой.
- CV в исходниках, сборке и публичном ответе имеет SHA-256 `07215bd5f59e15b2cef60c82eb6601f99330e8dda9cab4c92e96d6c9147419b3`; скачивание кнопкой через Chromium прошло, PDF неизменён.
- Chromium/Playwright на локальной сборке и публичном сайте: прямые ссылки `/#ai`, `/#admin`, `/#security`, один видимый раздел, переключение направлений, ArrowRight/Home/End, раскрытие деталей через Enter, увеличение изображения, Escape и возврат фокуса.
- Ширины 320, 375, 390 и 768 px: горизонтального переполнения нет во всех направлениях. Проверен режим reduced motion; ошибок JS/console нет. Просмотрены desktop/mobile скриншоты локальной сборки.
- CC `/` и `/english.html` до и после: HTTPS 200, тела ответов побайтно совпадают.
- `/.git/config`, `/.env`, `/docs/HANDOFF.md`, `/content/projects.json`, `/scripts/build.mjs`, `/qa.html` возвращают 404.
- Подробные локальные результаты и манифест: `~/work/tmp/portfolio-refine-publish-20261113/` (не публикуются как файлы сайта).

Независимое ревью, Safari/Firefox, физические устройства и screen reader в этой публикации не проверялись. Это проверка публикации владельцем порученной версии, не подтверждение работы описанных в портфолио внутренних приложений.

### Откат этого выпуска

Команды подготовлены; откат не потребовался и не выполнялся. Проверка текущей цели предотвращает перезапись последующей публикации. Caddyfile остаётся без изменений.

```bash
ssh -o BatchMode=yes audio-app 'bash -se' <<'ROLLBACK'
set -euo pipefail
cd /var/www/portfolio
[ "$(readlink current)" = 'releases/20261113T233114Z-4ad5f1c03ed1' ]
[ -d 'releases/20261112T182811Z-2b01cf8e298c' ]
[ ! -e current.rollback ] && [ ! -L current.rollback ]
ln -s 'releases/20261112T182811Z-2b01cf8e298c' current.rollback
mv -Tf current.rollback current
readlink current
ROLLBACK
curl --fail --silent --show-error -o /dev/null https://portfolio.appli-lab.pl/
```

Следующий шаг: владелец оценивает опубликованную версию и решает по PR #3. Дополнительная публикация для этой задачи не требуется.

## Доработка первого экрана и примеров — 2026-11-14

Исторический статус подготовки: изменения проверены локально. Публикация уже выполнена; фактический результат приведён в разделе выше.

Ветка: `refine/portfolio-process-examples-v1`, основана на `feat/portfolio-initial-site` (опубликованная версия). Другую открытую ветку с формулировкой junior не включать.

### Что изменено

- Одно короткое вступление и один переключатель направлений. Повторяющиеся заголовки и боковое меню удалены; APPLI появляется раньше.
- Увеличены подписи, статусы, теги, ссылки, основной текст карточек и технические детали. Исправлен перенос навигации на узком экране.
- Общие схемы заменены на конкретные примеры: задача → отдельный worktree → ревью другим агентом → проверка владельцем; запись → Whisper → проверенные файлы на Google Drive; Hybrid Join/Intune → Conditional Access → проверка доступа; публикация страницы по HTTPS; документация упражнений в Git; разбор Nmap и HTTP в учебной лаборатории.
- Сохранены существующий визуальный стиль, изображения проектов, ссылки и PDF CV. Audio Studio обозначен отдельно от работающего ручного процесса.

### Выполненные проверки

- `npm run build`, `npm run check`, `node --check scripts/build.mjs`, `git diff --check`.
- Chromium: desktop, мобильные области 390 и 320 px без горизонтального переполнения; переключение направлений; ArrowRight/Home/End; раскрытие деталей через Enter; увеличение изображения, Escape и возврат фокуса.
- При мобильной области 390 px первая карточка начинается примерно на 580 px раньше прежней версии (измерение локального макета, не метрика производительности).
- Визуально проверены первый экран, мобильные версии и пример взаимодействия агентов.
- SHA-256 CV: `07215bd5f59e15b2cef60c82eb6601f99330e8dda9cab4c92e96d6c9147419b3`.
- Независимое ревью, Safari, физические устройства и screen reader не проверялись.

### Задание серверному Codex: опубликовать эту версию

1. Прочитать AGENTS.md и этот раздел. Получить ветку `refine/portfolio-process-examples-v1` из `DenysNew/portfolio` в отдельный чистый checkout/worktree, записать точный SHA. Не перезаписывать чужие рабочие изменения, не сливать другие PR и не обходить защиту main/master.
2. Выполнить сборку и проверки выше. Проверить неизменность CV. В публикуемом dist должны быть только штатные статические файлы — без временной QA-страницы.
3. Через существующий SSH alias `audio-app` проверить текущую цель `/var/www/portfolio/current` и записать её для отката. Сохранить контрольную сумму существующего Caddyfile; конфигурацию не менять.
4. Опубликовать новый каталог в `/var/www/portfolio/releases/` по существующей процедуре `scripts/deploy.sh`, дополненной сверкой SHA-256 всех файлов до переключения. Атомарно переключить `current` только после сверки. Не менять DNS, доступы, другие сайты и Caddyfile. Для статических файлов reload/restart Caddy не нужен.
5. Проверить публичный HTTPS с обычной валидацией TLS, совпадение опубликованных файлов со сборкой, три направления, раскрытие деталей, просмотр изображения, мобильную ширину и скачивание PDF. Проверить, что CC `/` и `/english.html` продолжают отвечать. При проблеме атомарно вернуть сохранённую предыдущую цель current.
6. Дописать в HANDOFF фактический SHA, путь выпуска, прежнюю цель current, результаты проверок и статус публикации. Не выдавать подготовку за выполненный деплой.

## История предыдущей публикации

Обновлено 2026-11-12, Codex. Публикация завершена.

## Результат

- Сайт: **https://portfolio.appli-lab.pl/**. Направления: `/#ai`, `/#admin`, `/#security`.
- Репозиторий: https://github.com/DenysNew/portfolio, ветка `feat/portfolio-initial-site`.
- Исходный опубликованный коммит: `2b01cf8e298c50f9cc3f3f8e6d899f3f5c8e8ac6`. Последующие изменения README/документации не меняют сборку.
- Исходники взяты из архива владельца `Projects/Portfolio/Denys_Nevskyi_portfolio_source.zip` на Google Drive. Передача архива и задания проверена `rclone check`: 2 файла, 0 различий.
- Импортированы исходники без готового `dist/` и внешнего устаревшего отчёта.
- Устаревшая ссылка на тренажёр заменена на проверенный `https://cc.appli-lab.pl/`; добавлен `https://cc.appli-lab.pl/english.html`.
- PDF CV побайтно сохранён из архива: SHA-256 `07215bd5f59e15b2cef60c82eb6601f99330e8dda9cab4c92e96d6c9147419b3`.
- Скриншоты APPLI показывают демонстрационный режим; новые изображения и утверждения о квалификации не добавлялись.

## Размещение

Существующий сервер Audio Studio, SSH-псевдоним `audio-app`. Только статические файлы и отдельный блок Caddy; без Node-сервиса, Docker и изменений доступа, DNS или других сайтов.

- Выпуск: `/var/www/portfolio/releases/20261112T182811Z-2b01cf8e298c`.
- `/var/www/portfolio/current` → `releases/20261112T182811Z-2b01cf8e298c`.
- Это первый выпуск; предыдущего `current` не было.
- Владелец файлов — существующий пользователь `ubuntu`; каталоги 755, файлы доступны Caddy для чтения, без 777.
- Сборка из чистого checkout. Использована процедура, эквивалентная `scripts/deploy.sh`, с SHA-256-проверкой **всех** переданных файлов до атомарного переключения ссылки. Скрипт из архива сам проверяет только наличие `index.html` после передачи.
- Конфигурация: `/etc/caddy/Caddyfile`.
- Резервная копия: `/etc/caddy/Caddyfile.before-portfolio-20261112T182811Z-2b01cf8e298c`.
- SHA-256 исходной конфигурации: `e44b4a80c6760cb0856350029ad86ef4430f92f5e2ac08e0dcff832622c75825`.
- SHA-256 конфигурации после публикации: `0c1e7032cffb5b5cae3fe792137c8a65a73010595c423b745493dea59480bb97`.
- Существующий блок CC сохранён побайтно, блок портфолио добавлен из `deploy/Caddyfile.example`. Конфигурация проверена до установки и перед reload. Выполнен `systemctl reload caddy`, без restart.

## Проверено

- `npm run build`, `npm run check`, `bash -n scripts/deploy.sh`, `git diff --check` прошли; рабочая сборка на Node v26.13.0 (требование — 22+).
- DNS A подтверждён для целевого сервера, AAAA отсутствует. Записи не изменялись.
- HTTPS 200 с обычной проверкой цепочки и имени сертификата, без отключения TLS-проверок. Let’s Encrypt, срок до 2027-02-10 17:30:24 UTC.
- HTTP → HTTPS: 308.
- Все 9 опубликованных файлов совпали с локальным `dist/` по SHA-256, включая HTML, CSS, JS, favicon, 3 изображения и PDF. PDF отдаётся как `application/pdf`.
- `/.git/config`, `/.env`, `/.env.local`, `/content/projects.json`, `/scripts/build.mjs`, `/docs/HANDOFF.md`, `/deploy/Caddyfile.example`, `/AGENTS.md`, `/package.json` и несуществующая страница возвращают 404.
- Chromium/Playwright на локальной сборке и на публичном HTTPS: три прямые ссылки, выбор направления, раскрытие проектов через Enter, клавиши ArrowRight/Home/End, увеличение изображения, Escape и возврат фокуса, ширины 375/390/768 px без горизонтального переполнения. Проверен режим prefers-reduced-motion. Ошибок JS/console не обнаружено.
- Визуально просмотрены скриншоты desktop/mobile и предоставленные изображения проектов.
- CC `/` и `/english.html` до и после публикации: HTTPS 200, тела ответов побайтно совпадают.
- Caddy active; после reload в журнале нет ошибок. Предупреждение о форматировании существующего Caddyfile было до публикации; предупреждения об отсутствии HTTP/2/3 на HTTP-порту относятся к перенаправлению на HTTPS.

## GitHub и границы проверки

Установленный глобальный pre-push запрещает агентам push в main/master. Защита не обходилась: исходники опубликованы в рабочей ветке, для main используется PR. Слияние оставлено владельцу.

Проверки автора не являются независимым ревью. Ревью другим агентом, Firefox/Safari, физические мобильные устройства, screen reader и полный аудит доступности не выполнялись. Автопродление сертификата ещё не наступило. Работа внутренних приложений APPLI/Audio Studio этой публикацией не подтверждается. Существующий сайт CC проверен указанными страницами.

## Точный откат первой публикации

Это инструкции, **не выполненный откат**. На первом выпуске прежнего сайта портфолио нет: откат убирает только его блок, возвращая исходный Caddyfile с CC. Выпуск и текущая ссылка сохраняются для повторного включения.

Запустить с рабочего сервера:

```bash
ssh -o BatchMode=yes audio-app 'bash -se' <<'ROLLBACK'
set -euo pipefail
backup=/etc/caddy/Caddyfile.before-portfolio-20261112T182811Z-2b01cf8e298c
expected=0c1e7032cffb5b5cae3fe792137c8a65a73010595c423b745493dea59480bb97
original=e44b4a80c6760cb0856350029ad86ef4430f92f5e2ac08e0dcff832622c75825
[ "$(sudo sha256sum /etc/caddy/Caddyfile | cut -d ' ' -f1)" = "$expected" ] || {
  echo 'Caddyfile изменился после публикации; остановка без перезаписи чужих изменений.' >&2
  exit 1
}
[ "$(sudo sha256sum "$backup" | cut -d ' ' -f1)" = "$original" ]
sudo caddy validate --config "$backup" --adapter caddyfile
saved=$(sudo mktemp /etc/caddy/Caddyfile.portfolio-before-rollback.XXXXXX)
sudo cp -a /etc/caddy/Caddyfile "$saved"
stage=$(sudo mktemp /etc/caddy/Caddyfile.portfolio-rollback.XXXXXX)
sudo cp -a "$backup" "$stage"
sudo mv -T "$stage" /etc/caddy/Caddyfile
if ! sudo systemctl reload caddy; then
  sudo cp -a "$saved" /etc/caddy/Caddyfile
  sudo systemctl reload caddy
  exit 1
fi
sudo systemctl is-active caddy
curl --fail --silent --show-error -o /dev/null https://cc.appli-lab.pl/
curl --fail --silent --show-error -o /dev/null https://cc.appli-lab.pl/english.html
ROLLBACK
```

Если контрольная сумма изменена последующими работами, полный backup не восстанавливать: подготовить конфигурацию без блока портфолио с сохранением новых чужих изменений, проверить и reload. Для следующих выпусков сохранять предыдущую цель `current` и возвращать её через новую ссылку и атомарный `mv -Tf`; Caddy для замены статических файлов перезагружать не нужно.

## Следующий шаг

Владелец проверяет визуальный результат и PR. Дальнейшие изменения контента — отдельная задача; исходный PDF не переписывать автоматически.

## Administracja IT — evidence-led simplification, 2026-11-14

- Replaced four broad administration cards with three concrete cases: Active Directory/Microsoft 365, DHCP troubleshooting, and Ubuntu/OpenVPN. Removed the repeated agents card from this track. The hybrid case is shared with Security, so its evidence is updated there too.
- Short configuration + result on the first view, compact headings, existing clickable photo piles, and optional “Zakres i szczegóły”. Added optional `result` and `detailsLabel` fields; other cards retain their existing role/details rendering.
- Source of technical claims: public `DenysNew/learning-admin` at `3f21bb384a6a637112d123389ffef9bf3ae3c258`, especially AD/Entra synchronization, M365 user/license management, Conditional Access compliant-device comparisons, DHCP after DC promotion, and OpenVPN/network-access notes. Available conversation history supplied context; source records and screenshots determine the concrete claims. No new lab tests were performed.
- Nine authentic screenshots were cropped and stripped of metadata. Opaque masks hide tenant/connector names, a device GUID, personal account names, IPv6 identifiers and VPN profile/endpoint details. Only isolated private **laboratory** IPv4 addresses and the lab.local test domain remain to make DHCP/DNS/ping evidence interpretable; no production address inventory, certificate material or keys are included. Originals are unchanged.
- Reproduction: `node scripts/prepare-admin-images.mjs /path/to/learning-admin`. Source paths, crop/mask coordinates and SHA-256 hashes are in `docs/admin-image-provenance.json`. Prepared assets were visually checked. Screens preserve genuine historical states, including a disabled startup flag on the running VPN service and the original DNS output; no states or text were reconstructed.
- FreeRADIUS, planned capabilities, commercial experience and certifications are not claimed. Project-server experience is distinguished from the VPN lab in expandable details. No CV content changes.
- Initial validation: `npm run build`, `npm run check`, `node --check scripts/build.mjs`, `git diff --check` passed. Responsive/gallery browser verification follows the private preview deployment.
- Public repository base inspected: main `b218a5f84101e482e49ccdde15866f42da4a95e6` after merged PR #4. Application source matched this preview before the edit. Updating the private preview does not update `portfolio.appli-lab.pl`; its server deployment remains a separate step.
- Browser validation completed on the owner-private preview `https://denys-portfolio-workshop.dicednacre.chatgpt.site/#admin`, source `b5df4273a5d7f64a51032826ec1406af21bc0dd4`: three administration cards, nine loaded images, keyboard gallery open/ArrowRight/Escape/focus return, click navigation, expandable details, track keyboard navigation and matching Administration CV link. All four PDF SHA-256 values match the previously published files.
- Fixed a real responsive issue: a landscape third image in a mixed-orientation pile exceeded the mobile width. The new selector moves only that case within the pile. No clipping/overflow hiding was introduced. Tested 390×844 and 375×812: content and scroll widths match (375/375 and 360/360 respectively). Desktop reset to its normal width; no JS errors observed. Browser proof: `docs/evidence/admin-tab.png`; first-block crop: `docs/evidence/admin-tab-top.png`.
- Existing AI project copy and the standalone security-learning entry were compared against the public main commit and are unchanged. Shared hybrid evidence appears in Security by design. `src/app.js` and all CVs are unchanged. Safari/Firefox, physical devices and screen-reader behavior were not tested.
- Server handoff: build and check this PR's exact commit from a clean checkout, transfer only `dist/` into a new release, verify the full SHA-256 manifest before switching `/var/www/portfolio/current`, retain the actual previous release for rollback, and verify HTTPS plus `/#admin`, all nine images, the shared Security card, mobile layout and CV. Follow `docs/DEPLOYMENT.md`. Do not edit Caddy, DNS or CC Practice. No AWS deployment was executed from this environment.

## Administracja IT — four areas, 2026-11-14

This section supersedes the three-case arrangement and masking policy above.

- The Administration track now has four subject areas, in order: Windows Server / Active Directory; Microsoft 365 / Entra ID / Intune; Linux / server maintenance; networks / remote access. DHCP troubleshooting is a concrete result inside Windows; VPN connectivity belongs to Networks. The Microsoft card remains shared with Security.
- Each area retains a short summary, a verified historical result, a clickable photo pile and three optional detail sections. No new interaction model or CV changes.
- Fifteen original lab captures: AD OU structure, RSAT, DHCP before/after and DNS; Entra sync, Intune, Conditional Access and two Teams license tests; Linux permissions and systemd service state; VirtualBox network, VPN client and ping. Evidence repository remains learning-admin at 3f21bb384a6a637112d123389ffef9bf3ae3c258.
- At the owner's request, lab addresses, VM names, test users, tenant labels and the non-secret device identifier are visible. Screens are cropped to relevant application content and stripped of metadata; no masks or fabricated text. The source originals are unchanged. Public assets contain no keys, passwords or certificate contents. Crop geometry and source/output hashes are recorded in admin-image-provenance.json and reproducible with scripts/prepare-admin-images.mjs.
- Linux lab evidence is distinguished from own-project hosting. No claims of commercial deployment, new live lab validation or completed planned features. Existing AI entries and the standalone Security entry are unchanged.
- Build, existing content/assets checks and git diff --check passed: ten project entries, three tracks, four CV PDFs. Private-preview interaction and responsive verification follows publication. The own-domain server has not been changed.

- Preview QA found the nearly square license screenshot extending into the details divider. Kept it in the gallery and placed the wider Teams result fourth in the pile, leaving the layout and original screenshot intact.

- Final browser verification on owner-private preview commit d6af5ea6d7f898983d4dcad769c90cde47af9e56: all four galleries and fifteen images loaded; Enter, ArrowRight, next, Escape and focus return worked. Expanded Microsoft and Network details. Chrome widths 390 and 375 px had no horizontal overflow; after the pile-order adjustment the Microsoft images stayed above the details divider. Correct Administration CV mapping, desktop width restored, no captured JS errors. Current proof: docs/evidence/admin-four-areas.jpg. Earlier screenshots retain their historical filenames. Safari/Firefox and physical devices were not tested.
- Server handoff now covers FOUR administration areas and FIFTEEN images. Build this PR’s exact final commit and follow docs/DEPLOYMENT.md, keeping Caddy, DNS and CC Practice unchanged. This remains a draft PR; no public-server deployment or merge has been performed.
