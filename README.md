# Mini Twitter

Mini Twitter é uma rede social simples estilo “Twitter”, com API RESTful em Django REST Framework e frontend em React + Vite + TypeScript.

## 📦 Tech Stack

* **Backend**: Python 3.13, Django 4.x, Django REST Framework, SimpleJWT, PostgreSQL 14+
* **Frontend**: React, Vite, TypeScript, Axios, CSS Modules
* **Documentação**: Swagger (drf-yasg) e Redoc
* **Testes**: pytest, coverage

## 🚀 Pré-requisitos

Antes de começar, instale em sua máquina:

* Python 3.13
* Node.js (v16+)
* PostgreSQL (14+)
* Git

## 🔧 Configuração e execução

### 1. Clone o repositório

```bash
git clone https://github.com/PedroDutrajs/mini_twitter.git
cd mini_twitter
```

### 2. Backend

1. Crie e ative um ambiente virtual:

   ```bash
   python -m venv .venv
   source .venv/bin/activate    # macOS/Linux
   .venv\Scripts\activate     # Windows
   ```
2. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```
3. Configure as variáveis de ambiente copiando o exemplo:

   ```bash
   cp .env.example .env
   ```

   Preencha em `.env`:

   ```ini
   SECRET_KEY=django-insecure-...  
   DEBUG=True
   ALLOWED_HOSTS=127.0.0.1,localhost
   DB_NAME=mini_twitter
   DB_USER=postgres
   DB_PASSWORD=adminadmin
   DB_HOST=localhost
   DB_PORT=5432
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```
4. Rode as migrações:

   ```bash
   python manage.py migrate
   ```
5. Inicie o servidor:

   ```bash
   python manage.py runserver
   ```

   A API estará disponível em `http://localhost:8000/api/`.

### 3. Frontend

Abra outro terminal dentro da pasta `mini_twitter`:

1. Vá para o diretório do frontend:

   ```bash
   cd frontend/mini-twitter-frontend
   ```
2. Instale dependências:

   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

   No `.env`, ajuste:

   ```ini
   VITE_API_URL=http://localhost:8000/api
   ```
4. Inicie em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

   A aplicação frontend estará em `http://localhost:5173`.

## 🧪 Testes e Cobertura

### Backend

Execute todos os testes com pytest:

```bash
cd backend
pytest --maxfail=1 --disable-warnings -q
```

Para gerar relatório de cobertura:

```bash
coverage run -m pytest
coverage report -m
coverage html    # abrirá um relatório HTML
```

## 📑 Documentação da API

Ao subir o backend, acesse:

* **Swagger UI**: `http://localhost:8000/swagger/`
* **Redoc**:        `http://localhost:8000/redoc/`

Lá você verá todas as rotas, exemplos de payloads e poderá testar diretamente.

