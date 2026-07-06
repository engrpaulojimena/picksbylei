# ShopWithMe — TikTok Affiliate Website

TikTok-inspired affiliate product showcase built with **Next.js 14 + Neon PostgreSQL + Drizzle ORM**.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Inline CSS (TikTok dark theme — black/red/cyan)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env.local
# Then paste your Neon DATABASE_URL sa .env.local
```

### 3. Push schema to Neon
```bash
npm run db:push
```

### 4. Seed sample data
```bash
npm run db:seed
```

### 5. Run dev server
```bash
npm run dev
```

## Pages
| Route | Description |
|-------|-------------|
| `/` | Home — Hero + Featured + Trending |
| `/products` | All products with search + category filter |
| `/trending` | Hot products only |
| `/admin` | Add products (simple form) |

## API Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | Get all products. Query params: `category`, `search`, `featured`, `hot` |
| POST | `/api/products` | Add new product |
| GET | `/api/categories` | Get all categories |

## Customization
1. **Palitan ang `@yourusername`** sa `Navbar.tsx` at `Hero.tsx` ng TikTok username mo
2. **Palitan ang site name** na "ShopWithMe" — search and replace sa buong project
3. **Mag-add ng products** sa `/admin` page o gamit ang seed file
4. **I-update ang affiliate links** — basta ilagay yung actual TikTok Shop affiliate URL mo

## Adding Products via Admin
1. Pumunta sa `http://localhost:3000/admin`
2. Punan ang form
3. I-paste ang TikTok affiliate link mo
4. Submit!
