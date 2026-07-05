# 🌿 AgriChat — AI Agricultural Advisory for Uttarakhand

> An AI-powered chatbot for farmers and agricultural supervisors in Uttarakhand's mountain regions. Ask questions in plain language and receive practical, localised crop guidance powered by Google Gemini.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your API key
```bash
cp .env.example .env
# Edit .env and add your Gemini API key
# Get a free key at: https://aistudio.google.com/apikey
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Backend Quick Start (FastAPI)

Follow these steps to run the backend API locally.

### 1. Set up a Python Virtual Environment
Navigate to the `backend` folder and create a virtual environment:
```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:
- **Windows (PowerShell)**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
- **Windows (CMD)**:
  ```cmd
  .venv\Scripts\activate.bat
  ```
- **macOS / Linux**:
  ```bash
  source .venv/bin/activate
  ```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Up Environment Variables
Create a `.env` file in the `backend/` directory:
```bash
cp .env.example .env
# Edit .env and configure your variables (e.g. database path, optional Gemini API key)
```

### 4. Run the API Server
```bash
uvicorn app.main:app --reload
```

The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000). You can view the interactive Swagger documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

## 🗄️ Database Integration

### 1. Database Choice and Rationale
We selected **MongoDB Atlas** as the cloud database for the AgriChat project, integrated using the official **PyMongo** client.

**Why MongoDB Atlas?**
- **Cloud-Native Document Storage**: MongoDB Atlas is a fully managed cloud database, offering high availability, instant scalability, and zero local hardware dependency.
- **Dynamic Schemas**: Document-based storage matches our high-dimensional agricultural advisory queries and responses perfectly without complex, rigid migrations.
- **Robust Driver Ecosystem**: Communicates seamlessly using the official PyMongo driver.

---

### 2. Schema and Data Model Design
We designed a schema with three collections to capture application context:

1. **users**: Represents registered agricultural supervisors or administrators.
2. **advisories**: Represents localized crop queries submitted by farmers and the generated AI recommendations.
3. **counters**: Stores auto-incrementing integer sequence state for `users` and `advisories` to maintain simple, sequential primary keys.

#### Relationships
- **Referential One-to-Many**: An advisory document optionally links back to the user who created it via the `created_by_id` field referencing a user's integer `id`.

#### Schema Diagram
Below is the visual database schema diagram illustrating the collections, fields, types, and their relationship:

![Database Schema Diagram](./public/schema_diagram.png)

#### Code Implementation
The database client configuration and CRUD operations are committed and defined in [database.py](file:///c:/Users/abc/OneDrive/Desktop/AgriChat/backend/app/database.py) and [crud.py](file:///c:/Users/abc/OneDrive/Desktop/AgriChat/backend/app/crud.py).

---

### 3. Set Up the Database
Follow these steps to configure database connectivity:

1. **Set Environment Variable**:
   Ensure you have a `.env` file in the `backend/` folder (copied from `.env.example`). It must define the `MONGO_URI` connection string:
   ```env
   MONGO_URI=mongodb+srv://harshithatumbali2007_db_user:Harshi123@cluster0.tuk0ob0.mongodb.net/?appName=Cluster0
   ```

2. **Database Initialization**:
   The client automatically opens a connection to the MongoDB cluster upon server startup. If collections or indexes do not exist, PyMongo initializes them dynamically on write.

3. **Verify and Seed Database (Testing)**:
   We have included an automated API verification script that clears the test collections, seeds fresh mock documents, and validates end-to-end CRUD operations. Run it using:
   ```bash
   python verify_api.py
   ```

---

## 🧩 Components

| Component | Path | Description |
|-----------|------|-------------|
| `Navbar` | `src/components/Navbar.jsx` | Logo, 4 nav links, notification/chat/profile icons. Fully responsive with mobile hamburger menu. |
| `Hero` | `src/components/Hero.jsx` | Full-screen hero with animated headline, CTA buttons, stats, and a live chat preview mock. |
| `Card` | `src/components/Card.jsx` | Reusable card with `title`, `description`, `image`, `tag`, `actionLabel`, `actionLink`/`actionHref`, and `variant` props. |
| `Footer` | `src/components/Footer.jsx` | Brand column, 3 link sections (Product/Resources/Legal), social icons, disclaimer, Gemini badge. |

---

## 📄 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with Hero section and 4 feature cards |
| `/chat` | Chat | Full chat interface with Gemini API integration |
| `/about` | About | Mission, team cards, core principles, disclaimer |
| `/login` | Login | Auth form shell (connect your provider) |

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **AI**: Google Gemini 2.0 Flash API

---

## 🔑 Environment Variables

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ Never commit your actual `.env` file. Only `.env.example` is tracked.

---

## ⚠️ Disclaimer

All responses provided by AgriChat are generated by an AI model for informational purposes only. Always verify critical decisions with a **licensed agricultural extension officer** before taking action.

---

## 📁 Project Structure

```
AgriChat/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Card.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Chat.jsx
│   │   ├── About.jsx
│   │   └── Login.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── index.html
├── vite.config.js
└── package.json
```

---

Made with 💚 for Uttarakhand farmers.
