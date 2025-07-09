````markdown
# 🏗️ Multitenancy Scaffold Web App

A modern, dashboard-based multitenancy web application built with **Next.js** and **TypeScript**, following the **Next Breeze** architecture.

This scaffold is ideal for applications where users may belong to **multiple tenants** and hold **multiple roles per tenant** (e.g., Admin, Manager, Member). It includes a role-based access control (RBAC) system and a working feature for **tenant-specific announcements**.

Built with a modular, clean UI using **Tailwind CSS** and **ShadCN** components.

---

## 📸 Screenshots

### 🔐 Login Page

![Login Screenshot](./public/screenshots/login.png)

### 📊 Tenant Dashboard

![Dashboard Screenshot](./public/screenshots/dashboard.png)

---

## 🧩 Features

- ✅ **Next.js (App Router)** with TypeScript
- ✅ **Next Breeze** architecture
- ✅ **Multitenancy**: users can belong to multiple tenants and switch context
- ✅ **Multi-role RBAC** per tenant (Spatie-style)
- ✅ **Authentication** via Laravel Breeze API
- ✅ **ShadCN UI components**
- ✅ **Tailwind CSS** with full utility-first styling
- ✅ **Dashboard layout with protected routes**
- ✅ **Tenant-based Announcements**

---

## 🛠️ Tech Stack

| Layer            | Technology                            |
|------------------|----------------------------------------|
| Frontend         | [Next.js](https://nextjs.org/)         |
| Language         | TypeScript                             |
| Styling          | Tailwind CSS + [ShadCN](https://ui.shadcn.dev) |
| Auth             | Laravel Breeze (API backend assumed)   |
| Roles/Permissions| Custom RBAC system per tenant          |
| UI Components    | ShadCN UI                              |

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/your-org/multitenancy-scaffold-web-app.git

cd multitenancy-scaffold-web-app

# Install dependencies
npm install

# Create and configure the environment
cp .env.example .env.local
````

Update your `.env.local` file to set:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Run the App

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧱 Folder Structure

```
📁 /app
├── (auth)         # Login/Register routes
├── (dashboard)    # Protected tenant-based dashboard
├── layout.tsx     # Auth/session provider wrapper

📁 /components      # Reusable UI (includes ShadCN components)
📁 /hooks           # Custom hooks (e.g., useAuth, useTenant)
📁 /lib             # Utilities (auth client, API client)
📁 /types           # Global types and interfaces
📁 /public/screenshots
📁 /styles          # Tailwind base + custom styles
```

---

## 🔐 Role-Based Access (Per Tenant)

RBAC is scoped by tenant. A single user can be:

* an **Admin** in one tenant,
* a **Member** in another.

Access control is handled using role guards and custom hooks.

```ts
const { roles, tenant } = useAuth()

if (roles.includes("admin")) {
  // Render admin controls
}
```

---

## 📨 Announcements Feature

Each tenant can manage their own announcements:

* Admins can create/edit/delete announcements.
* Members see announcements scoped to their current tenant.
* Fully protected by roles and tenant context.

---

## 🏢 Tenant Switching

Users can seamlessly switch between tenants:

```ts
const { currentTenant, switchTenant } = useTenant()

switchTenant('tenant-id')
```

ShadCN dropdown UI is used for the **tenant switcher**.

---


## 🛤 Future Enhancements

* 🧾 Billing and subscription logic

---

## 🤝 Contributing

Got suggestions or improvements? Feel free to open issues or submit pull requests.

---

## 📜 License

MIT License © 2025 N1375N13

