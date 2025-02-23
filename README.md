# 🇨🇦 Politicate 🇨🇦
### Empowering locals with simple, accessible political literacy

## Pre-requisites
Before running **Politicate**, make sure you have the following installed:

### **1️⃣ Install `uv` (Python Environment & Dependency Manager)**
[Official UV Installation Guide](https://docs.astral.sh/uv/getting-started/installation/)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### **2️⃣ Install `npm` (Node.js Package Manager)**
Install Node.js from [nodejs.org](https://nodejs.org/en/download), which includes `npm`.
Verify installation:
```bash
node -v   # Check Node.js version  
npm -v    # Check npm version  
```

---
## Setup & Running Instructions

### **Backend (FastAPI) Setup**

1️⃣ **Navigate to the backend folder:**
```bash
cd backend
```

2️⃣ **Create a `.env` file** inside `backend/` and add the following:
```ini
PSE_API_KEY=your-api-key
GOOGLE_CLOUD_API_KEY=your-api-key
SUPABASE_PROJECT_URL=your-url
SUPABASE_API_KEY=your-api-key
SUPABASE_SERVICE_KEY=your-service-key
OPENAI_API_KEY=your-api-key
```

3️⃣ **Install dependencies and run the backend:**
```bash
uv run fastapi dev   # Start the FastAPI server  
```
The backend runs on **`http://localhost:8000`**.

---
### **Frontend Setup**

1️⃣ **Navigate to the frontend folder:**
```bash
cd frontend
```

2️⃣ **Create a `.env.local` file** inside `frontend/` and add the backend URL:
```ini
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

3️⃣ **Install dependencies and start the frontend:**
```bash
npm install
npm run dev
```
The frontend runs on **`http://localhost:3000`**.

---
## License
This project is open-source under the **MIT License**.

---
### 🎉 Now, You're Ready to Explore Politicate! 🚀

