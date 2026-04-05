# Zorvyn Finance — Premium Finance Dashboard

A production-grade finance dashboard built with React, Tailwind CSS, and TypeScript. Features a dark luxury aesthetic with frosted-glass UI, role-based access control, animated charts, and a simulated API layer.

## Tech Stack

- **React 18** + **TypeScript 5** — UI framework
- **Tailwind CSS 3** — Utility-first styling with custom design tokens
- **Recharts** — Line, Pie, and Bar charts
- **React Router 6** — Client-side routing
- **React Context + useReducer** — Global state management
- **Sonner** — Toast notifications
- **Shadcn/ui** — Accessible component primitives
- **Google Fonts** — DM Serif Display (headings) + DM Sans (body)

## How to Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Features

### Dashboard Overview
- 4 animated summary cards: Total Balance, Income, Expenses, Savings Rate
- Line chart showing 6-month balance trend
- Donut chart for spending by category with legend
- Skeleton loaders while data loads from mock API

### Transactions
- Full table with Date, Description, Category, Amount (color-coded), Type badge
- Real-time search filtering by description
- Category and Type dropdown filters
- Sort by Date or Amount (ascending/descending toggle)
- Admin-only: Add, Edit, Delete transactions via modal forms
- CSV export of currently filtered data (in INR)
- Empty state UI when no transactions match filters
- Mobile card-list layout

### Insights
- Highest Spending Category with progress bar
- Month-over-Month grouped bar chart
- Biggest Single Expense card
- Spending Streak tracker
- Skeleton loaders while insights load

### Role-Based UI
- **Admin**: Full CRUD access to transactions
- **Viewer**: Read-only — all Add/Edit/Delete controls hidden
- Role switcher in Settings page
- Current role badge visible in navbar at all times

### Mock API Integration
- Simulated backend via `src/api/mockApi.ts`
- All API calls have **600–900ms artificial delay** to simulate real network latency
- **10% random failure rate** — failed calls show toast error notifications
- "Syncing..." spinner in navbar during any in-flight API call
- Skeleton loaders on all pages while data is loading

#### Available Mock API Functions

| Function | Returns |
|---|---|
| `getAllTransactions()` | Full transactions array |
| `addTransaction(data)` | New transaction with generated ID |
| `updateTransaction(id, data)` | Updated transaction object |
| `deleteTransaction(id)` | `{ message: 'Transaction deleted successfully' }` |
| `getSummaryStats()` | `{ totalBalance, totalIncome, totalExpenses, savingsRate }` |
| `getInsights()` | `{ topCategory, biggestExpense, monthComparison }` |

#### Error Handling
- Each mock API call has a 10% chance of throwing an error
- Failed calls trigger a toast notification: "Something went wrong. Please try again."
- The app state is only updated on successful API responses
- The navbar shows a "Syncing..." indicator with spinner while any API call is in flight

### Additional Features
- Dark/Light mode toggle (persists in localStorage)
- Fade-in page transitions
- Polished hover states and micro-interactions on glass cards
- Dot-grid background texture
- Responsive: sidebar → bottom tab bar on mobile

## Role Switching

1. Navigate to **Settings** via the sidebar
2. Under **Role Management**, select "Admin" or "Viewer"
3. The role persists in localStorage across page refreshes
4. The current role badge is always visible in the top navbar

## Mock Data

35 realistic INR transactions spanning Nov 2024 – Apr 2025, including entries like Swiggy Order, Uber Ride, Netflix Subscription, Salary Credit, Amazon Purchase, Gym Membership, Electricity Bill, Freelance payments, and Dividends.

## Assumptions

- All data is client-side only (no real backend)
- Mock API simulates server behavior with delays and random failures
- Currency is INR (₹) throughout
- The % change indicators on dashboard cards are static/mock values
- localStorage is used for persistence (transactions, role, theme)

## Snapshots
<img width="1919" height="865" alt="image" src="https://github.com/user-attachments/assets/3eb13a9f-2dbc-41dc-80e7-6f45e4d49772" />
<img width="1919" height="867" alt="image" src="https://github.com/user-attachments/assets/f9d02c77-0f00-40ef-897d-e993f9402306" />
<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/9d7f9bee-2394-4c14-bbb5-2fb423bebf5f" />
<img width="1919" height="862" alt="image" src="https://github.com/user-attachments/assets/7cc737f1-83f7-4334-8d90-087ffba71bcd" />



