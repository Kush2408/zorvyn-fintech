

# Zorvyn Finance — Production-Grade Finance Dashboard

## Design System
- Dark luxury aesthetic: navy/charcoal backgrounds (#0D1117, #161B22), electric teal accent (#00D4AA), gold highlights (#F5C542)
- Google Fonts: "DM Serif Display" (headings) + "DM Sans" (body)
- Frosted-glass cards with glowing borders on hover, dot-grid background texture
- Dark mode default with light mode toggle

## App Structure

### Global State (React Context + useReducer)
- **TransactionsContext**: 25+ mock transactions (Nov 2024–Apr 2025) in INR, filters (search, category, type), sort state
- **RoleContext**: viewer/admin role, persisted in localStorage
- **ThemeContext**: dark/light mode toggle

### Layout
- Collapsible sidebar (icon mode on desktop, bottom tab bar on mobile)
- Top header with role badge, dark/light toggle, app branding
- Fade-in page transitions on route change

### Pages

**1. Dashboard Overview (`/`)**
- 4 summary cards: Total Balance, Total Income, Total Expenses, Savings Rate — each with icon, animated counter, and % change indicator
- Line chart: balance trend over 6 months (Recharts)
- Donut/pie chart: spending by category (Food, Transport, Entertainment, Shopping, Health, Utilities)

**2. Transactions (`/transactions`)**
- Search bar + category dropdown + type dropdown filters
- Sortable table (Date, Description, Category, Amount, Type badge)
- Mobile: card-list layout
- Admin-only: "Add Transaction" button → modal form; Edit/Delete icons per row
- CSV export button (exports filtered data)
- Empty state with illustration + message

**3. Insights (`/insights`)**
- Highest Spending Category card with progress bar
- Month-over-Month grouped bar chart (current vs previous)
- Biggest Single Expense card
- Spending Streak card

**4. Settings (`/settings`)**
- Role switcher (Viewer / Admin) with description
- Theme preference
- LocalStorage persistence info

### Mock Data
- 25+ transactions across Nov 2024–Apr 2025 with realistic Indian descriptions (Swiggy, Uber, Netflix, Salary, Amazon, Gym, Electricity, etc.), INR currency

### Responsiveness
- Sidebar → bottom tabs on mobile
- Cards: 4-col → 2-col → 1-col
- Table → card list on mobile
- Charts use ResponsiveContainer

### Enhancements
- Animated number counters on summary cards
- Smooth fade-in page transitions
- CSV export of filtered transactions
- LocalStorage persistence for transactions and role
- Empty state UI with illustration

