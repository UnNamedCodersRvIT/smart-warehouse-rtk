# Бэкенд

Стек: Python + FastAPI + SQLAlchemy

## Инструкция по настройке и запуску для разработчика

Этот README — быстрый старт для разработки backend локально на Windows. Инструкции рассчитаны на разработку с использованием `poetry` и `uvicorn`.

## Шаг 1 — Пререквизиты

Убедитесь, что на локальной машине установлено следующее:

- Python 3.14
- Git
- Poetry (рекомендуется использовать Poetry для управления зависимостями и виртуальным окружением)

Установка на Windows (рекомендуется PowerShell):

1. Python: загрузите и установите Python 3.14 с <https://www.python.org/downloads/windows/>.
  Во время установки поставьте галочку "Add Python to PATH".

2. Git: <https://git-scm.com/download/win>

3. Poetry: в PowerShell выполните

```pwsh
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
# затем закройте и откройте терминал
poetry --version
```

## Шаг 2 — Клонирование репозитория и переключение на ветку разработки

```pwsh
git clone https://github.com/UnNamedCodersRvIT/smart-warehouse-rtk
cd smart-warehouse-rtk\backend
git checkout develop
```

## Шаг 3 — Установка зависимостей

В директории `backend` используйте poetry, чтобы установить зависимости и создать виртуальную среду:

```pwsh
poetry config virtualenvs.in-project true
poetry install
```

Poetry создаст виртуальное окружение и установит пакеты, указанные в `pyproject.toml`.

## Шаг 4 — Настройка переменных окружения

Файл `.env.example` содержит шаблон переменных окружения. Скопируйте его в `.env` и при необходимости измените значения.

В `.env` в локальной разработке по умолчанию используется `sqlite` (DATABASE_URL=sqlite:///./dev.db). В продакшне указывайте Postgres URL и безопасный `JWT_SECRET_KEY`.

Важно: НЕ коммитьте `.env` с секретами в репозиторий. В `.gitignore` уже прописано игнорирование `.env`.

## Шаг 5 — Тесты и линтеры

Запустить pytest:

```pwsh
poetry run pytest -q
```

Запустить линтеры и форматирование (указаны в `pyproject.toml` как poe tasks):

```pwsh
poetry run poe lint
poetry run poe format
```

## Шаг 6 — Локальный запуск сервера

Запуск приложения в режиме разработки:

```pwsh
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 3000
```

API будет доступно по адресу: `http://localhost:3000`.

Swagger UI: `http://localhost:3000/docs`
