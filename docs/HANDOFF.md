# HANDOFF — Portfolio

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
