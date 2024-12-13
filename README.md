
# Trendora - eCommerce Web App

Trendora is a demo eCommerce web application showcasing basic features for both users and admins, including cart management, order placement, discount application, and store analytics.

---

## **Live Demo**
- **User-facing page:** [https://trendora-eight.vercel.app](https://trendora-eight.vercel.app)  
- **Admin dashboard:** [https://trendora-eight.vercel.app/admin/login](https://trendora-eight.vercel.app/admin/login)  

**Admin Credentials:**  
- Email: `admin@example.com`  
- Password: `password`  

---

## **Features**

### **User Features**
- Add products to the cart and adjust quantities.
- Place orders without requiring login.
- Apply discounts for eligible orders (every nth order).

### **Admin Dashboard Features**
- Login as admin to access the dashboard.
- Generate discount codes for eligible users.
- View store analytics, including:
  - Total items purchased
  - Total purchase amount
  - Total discount amount
  - All generated discount codes
  - Sales graph

---

## **Steps to Use This App**

1. **Visit the user-facing page**: Go to [https://trendora-eight.vercel.app](https://trendora-eight.vercel.app).  
2. **Add products to your cart**: Choose any products and set their quantities.  
3. **Open the cart**: Review your selected items.  
4. **Checkout and place your order**: Click checkout and complete your order.  
5. **Repeat this process four times**: Add products, checkout, and place orders.  

6. **Switch to the admin dashboard**: Visit [https://trendora-eight.vercel.app/admin/login](https://trendora-eight.vercel.app/admin/login) and log in using the admin credentials.  
7. **Generate a discount code**: Once a user is eligible (e.g., 5th order), a "Generate" button will appear. Click it to create a discount code.  

8. **Apply the discount**: Go back to the user-facing page and place your 5th order. During checkout, you will see the "Apply Discount" option. Use the discount code and complete your order.  

9. **View analytics**: Return to the admin dashboard to see updated analytics, including discount usage and sales graphs.  

10. **Repeat the process**: Discounts can be applied and generated again for every eligible order where `(orderCount + 1) % n === 0`.

---

## **Note**
- **Admin Feature for Discount Codes**: Once a user becomes eligible for a discount, the admin can generate multiple discount codes for the same eligibility period.  
   - This behavior has been **intentionally implemented** to provide admin control and is not a mistake.  
   - If required, this can easily be restricted to allow only one discount code per eligibility period.
- **N=5**: This is hardcoded for demo but can obviously be made dynamic. 

---

## **Tech Stack**
- **Frontend:** Next.js  
- **Backend:** Next.js API routes  
- **Database:** PostgreSQL with Prisma ORM  
- **UI:** shadcn/ui + Tailwind CSS  
- **Validation:** Zod  
- **Charts:** Recharts  
- **Deployment:** Vercel  

---

## **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/SanjokMangrati/trendora.git
   cd trendora
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```bash
   DATABASE_URL=your_postgres_database_url
   NEXT_PUBLIC_JWT_SECRET=your_secret_key
   NEXT_PUBLIC_APP_URL=app_url
   NEXT_PUBLIC_API_URL=api_url
   NEXT_PUBLIC_USER_ID=3
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

5. Access locally at: [http://localhost:3000](http://localhost:3000).

---

## **Limitations**
1. **Single User Setup:**  
   - All orders and sessions are tied to a single `userId` from the `.env` file for demo purposes.  
   - No support for multiple users or individual order tracking.

2. **Simplified Sessions:**  
   - Sessions track cart activity, but all orders are linked to the same user regardless of session.

3. **Admin Limitations:**  
   - No new admin registration; the default admin is pre-configured.

4. **Scalability Concerns:**  
   - Requires user authentication and dynamic `userId` assignment for real-world use.  
   - Database and logic restructuring needed for multi-user scalability.  

## Areas for Improvement

The following are areas that can be improved to enhance the application further:

- **UI Feedback**: Implement optimistic updates for better user experience.
- **Performance Enhancements**: Optimize the app's speed and responsiveness.
- **Security Improvements**: Implement enhanced security measures.
- **Scalibility focused Redesign**: Refactor the application for scalability and better data integrity.
- **Server-Side Rendering (SSR)**: Apply SSR wherever applicable for better performance and SEO.
- **Responsiveness**: Improve design responsiveness for smaller screen sizes.
- **Bug Fixes**: Address bugs and improve code quality.

---

This app is a **proof-of-concept** designed to demonstrate core features, not for production use.
