
# Trendora - eCommerce Web App

Trendora is an eCommerce web app with an admin dashboard, designed to showcase basic eCommerce functionalities. This app allows users to add products to their cart, manage product quantities, apply discounts, and place orders. The admin dashboard provides tools for managing discounts, viewing store analytics.

**Live Demo:**
- User-facing page: [https://trendora-eight.vercel.app](https://trendora-eight.vercel.app)
- Admin dashboard: [https://trendora-eight.vercel.app/admin/login](https://trendora-eight.vercel.app/admin/login)

**Credentials**
- Admin Dashboard: **email:** admin@example.com | **password:** password

## Features

### User Features:
- **Add items to the cart**
- **Increase or decrease the quantity of a product** in the cart
- **Apply discount coupon** to an order based on the nth order condition (every nth order gets a discount)
- **Place an order** without needing to log in (though login functionality for users for placing order is optimal, we are bypassing it for demo)

### Admin Dashboard Features:
- **Admin login** to access the dashboard
- **Generate discount coupons** for users who meet the nth order condition
- **View store analytics**, including:
  - Total items purchased
  - Total purchase amount
  - Total discount amount
  - All generated discount codes
  - Sales graph

### Security and Responsiveness:
- **Responsive design** ensuring compatibility across devices
- **Security features** including the use of `HttpOnly` cookies for better security (though further improvements can be made)

## Installation

To run this project locally, follow the steps below:

1. Clone the repository:
   ```bash
   git clone https://github.com/SanjokMangrati/trendora.git
   ```

2. Navigate into the project directory:
   ```bash
   cd trendora
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up the environment variables:
   Create a `.env` file and add the following:
   ```bash
   DATABASE_URL=your_postgres_database_url
   NEXT_PUBLIC_JWT_SECRET=your_secret_key
   NEXT_PUBLIC_APP_URL=app_url
   NEXT_PUBLIC_API_URL=api_url
   NEXT_PUBLIC_USER_ID=3
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Visit the application at [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Next.js API routes
- **UI**: shadcn/ui for UI components
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Validation**: Zod
- **Charts**: Recharts

## Notable Libraries Used

- **Zod**: For input validation
- **Recharts**: For displaying sales data and analytics

## Areas for Improvement

The following are areas that can be improved to enhance the application further:

- **UI Feedback**: Implement optimistic updates for better user experience.
- **Performance Enhancements**: Optimize the app's speed and responsiveness.
- **Security Improvements**: Implement additional security measures like encryption for sensitive data.
- **DB Schema Redesign**: Refactor the database schema for scalability and better data integrity.
- **Server-Side Rendering (SSR)**: Apply SSR wherever applicable for better performance and SEO.
- **Responsiveness**: Improve design responsiveness for smaller screen sizes.
- **Bug Fixes**: Address bugs and improve code quality.

## NOTE

- **User Login**: We are using a default user for the demo purpose, the user_id=3. Currently, users don’t need to log in to place an order.
- **Admin Dashboard Improvements**: We are using a default admin for demo, whose **email=admin@example.com** and **password=password**. Use this to login into dashboard.
