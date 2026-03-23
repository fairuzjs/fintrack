# 💸 FinTrack - Personal Finance Management System

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/NextAuth-4.x-purple?style=flat-square" alt="NextAuth.js" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

FinTrack is an interactive personal finance tracking and management system built with Next.js. This application provides a modern and well-structured platform for managing income and export transactions, custom category management, automated report generation and PDF downloads, combined with secure standalone user authentication.

## ✨ Key Features

### 👥 For Users / Personal

*   **Secure & Multi-Channel Authentication**
    *   Login and account registration are securely facilitated with `NextAuth.js`.
    *   Credentials and passwords are secured using `bcryptjs` hashing implementation.
    *   Session and account security information storage in the database (PostgreSQL + Prisma Enum).

*   **Financial & Cash Flow Management**
    *   Flexible and *real-time* recording of daily Incomes and Expenses.
    *   Integrated categorization for records (e.g., Monthly salary, Daily needs, Installments, etc.).
    *   Interactive UI Modal for transaction registration (optimized with the latest `AddTransactionModal` component).
    *   Data is seamlessly interpolated for real-time balance calculations.

*   **Currency Converter & Data Reporting**
    *   *Currency Converter* integration to accurately convert and estimate transaction values into various foreign exchange rates.
    *   Comprehensive filters on the transaction history list based on timeframes and category availability.
    *   Direct financial mutation history export into a tidy PDF document (`DownloadPdfButton` utilizes `jsPDF`).
    *   Centralized interactive dashboard powered by smooth transition animations from `Framer Motion`.

---

## 📸 Project Previews

Here are the *User Interface* displays and main visual snippets of the FinTrack system:

### 1. Main Dashboard
A concise summary regarding current balance, total income, total spent, along with overall charts or statistics.
![1. FinTrack Dashboard Preview](./public/screenshoot/dashboard.jpg)

### 2. Transaction Management
An interactive page and *popup* modal that allows you to classify data records (*Add Transaction/Expenses*).
![2. Transaction Management](./public/screenshoot/transaction.jpg)

### 3. Currency Converter
Currency conversion feature to facilitate the checking and estimation of exchange rates to various global currencies in *real-time*.
![3. Currency Converter](./public/screenshoot/currency.jpg)

---

## 🚀 Local Installation Guide

### System Requirements
*   **Node.js** version 18+ (or 20+)
*   Relational database such as **PostgreSQL** or MySQL (This project natively uses PostgreSQL).

### Steps to Run the Application

1. **Clone the Project Repository**
   ```bash
   git clone https://github.com/your-username/fintrack.git
   cd fintrack
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # Or if you use another package manager: yarn install / pnpm install
   ```

3. **Initialize Environment Variables**
   Create a `.env` file in the root directory and adjust the following parameters:
   ```env
   # Database Connection URL
   DATABASE_URL="postgresql://user:password@localhost:5432/fintrack?schema=public"

   # NextAuth Security Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="insert-your-random-secret-key-here"
   ```

4. **Initialize Database (Prisma ORM)**
   Sync the schema definition from `schema.prisma` to the database connection in `.env`:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` on your browser to view and interact with FinTrack locally!

---
© **2026 FinTrack Project**. Built for secure and fast self-recording. Licensed under **MIT**.
