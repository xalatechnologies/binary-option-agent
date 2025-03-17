# Frontend Layout, Authentication, and Styling Tasks

This checklist focuses exclusively on the layout, authentication, and styling aspects of the frontend. Each numbered story represents a major area with detailed one-story-point tasks for an AI coding agent to complete. All tasks are presented as unchecked checkboxes.

---

## 1. Global Application Layout

### 1.1 Create Global Layout Component
- [ ] **1.1.1 Create File:** `src/app/layout.tsx`
  - Define the root layout to include a header (navbar), optional sidebar, main content area, and footer.
  - Ensure the layout uses responsive design principles (e.g., flexible grid, responsive paddings).

### 1.2 Implement Header (Navbar)
- [ ] **1.2.1 In `src/app/layout.tsx`:**
  - Add a `<header>` element styled using CSS variables from `styles.css` (e.g., `background-color: var(--card-bg)`, `box-shadow: var(--shadow)`).
  - Include a logo (icon and text) and navigation links (e.g., Home, Dashboard, Trading, Settings).
  - Add an authentication control element (e.g., a “Sign In” button or user profile dropdown).
- [ ] **1.2.2 Create Storybook Stories:** `src/stories/Navbar.stories.tsx`
  - **State 1 (Logged Out):** Navbar shows logo, navigation links, and a “Sign In” button.
  - **State 2 (Logged In):** Navbar displays user profile information and a “Sign Out” option.

### 1.3 Implement Sidebar (Optional)
- [ ] **1.3.1 Create Component:** `src/components/Sidebar.tsx`
  - Display navigation options for different trading platforms and timeframes.
  - Style the sidebar with a collapsible/expandable behavior using Tailwind CSS and CSS variables.
- [ ] **1.3.2 Create Storybook Stories:** `src/stories/Sidebar.stories.tsx`
  - **State 1 (Collapsed):** Sidebar showing only icons.
  - **State 2 (Expanded):** Sidebar displaying full navigation labels.

### 1.4 Implement Main Content Area and Footer
- [ ] **1.4.1 Update `src/app/layout.tsx`:**
  - Ensure the `<main>` element uses responsive padding (e.g., `p-4`, `flex-grow`) and adapts to various screen sizes.
  - Add a `<footer>` element with copyright text and quick links (Privacy Policy, Terms, Contact).
  - Style the footer using CSS variables such as `var(--card-bg)` and `var(--text-light)`.
- [ ] **1.4.2 Create Storybook Stories:** `src/stories/Layout.stories.tsx`
  - **State 1 (Desktop):** Layout displays header, main content, and footer as expected.
  - **State 2 (Mobile):** Layout adapts with responsive header and footer adjustments.

---

## 2. Authentication Integration

### 2.1 Configure Authentication Backend
- [ ] **2.1.1 Update File:** `src/lib/auth/index.ts`
  - Configure NextAuth providers (e.g., Email) and Prisma adapter.
  - Use environment variables for sensitive data (e.g., `EMAIL_SERVER`, `NEXTAUTH_SECRET`).
  - Add inline documentation for the authentication flow.
- [ ] **2.1.2 Create API Route:** `src/app/api/auth/[...nextauth]/route.ts`
  - Implement the NextAuth API endpoint for handling sign in, sign out, and session management.

### 2.2 Create Authentication Pages (Frontend)
- [ ] **2.2.1 Create Sign In Page:** `src/app/auth/signin/page.tsx`
  - Render a sign-in form using Tailwind CSS and style variables (e.g., button color `var(--primary)`).
  - Integrate NextAuth’s `signIn` function.
  - Include form validation and error handling.
- [ ] **2.2.2 Create Storybook Stories:** `src/stories/SignIn.stories.tsx`
  - **State 1 (Empty Form):** Display form with placeholders.
  - **State 2 (Loading):** Show spinner while processing sign in.
- [ ] **2.2.3 Create Sign Out Page:** `src/app/auth/signout/page.tsx`
  - Render a sign-out confirmation with a “Sign Out” button that triggers NextAuth’s `signOut`.
- [ ] **2.2.4 Create Storybook Stories:** `src/stories/SignOut.stories.tsx`
  - **State 1 (Confirmation):** Display confirmation prompt.
- [ ] **2.2.5 Create Error and Verification Pages:**
  - **Error Page:** `src/app/auth/error/page.tsx` – Display error messages styled with `var(--danger)`.
  - **Verification Page:** `src/app/auth/verify/page.tsx` – Show verification status and instructions.
- [ ] **2.2.6 Create Storybook Stories:** `src/stories/AuthErrors.stories.tsx`
  - **State 1 (Error):** Error page with styled alert using `var(--danger)`.
  - **State 2 (Verification):** Page with verification message.

### 2.3 Integrate Authentication into Global Layout
- [ ] **2.3.1 Update Global Layout (`src/app/layout.tsx` or `src/components/ClientProvider.tsx`):**
  - Wrap the application with NextAuth’s `SessionProvider`.
  - In the header, conditionally display authentication controls (e.g., “Sign In” button when not authenticated, user profile dropdown when authenticated).
- [ ] **2.3.2 Create Storybook Stories:** `src/stories/NavbarAuth.stories.tsx`
  - **State 1 (Not Authenticated):** Navbar shows “Sign In” button.
  - **State 2 (Authenticated):** Navbar shows user’s profile with “Sign Out” option.

---

## 3. Global Styling & Theming

### 3.1 Setup Global Styles
- [ ] **3.1.1 Create/Update File:** `src/app/globals.css`
  - Import Tailwind base, components, and utilities.
  - Include global CSS rules from the provided style guide (e.g., CSS variables for colors, fonts, shadows, and border radii).
  - Ensure responsive design and dark mode support using `[data-theme="dark"]` selectors.
- [ ] **3.1.2 Verify font settings:** Use 'Inter' as the primary font.
- [ ] **3.1.3 Document styling in inline comments where necessary.

### 3.2 Theming and Responsive Design
- [ ] **3.2.1 Create Theme Provider Component:** `src/components/theme/ThemeProvider.tsx`
  - Wrap the application to support light/dark mode switching.
- [ ] **3.2.2 Create Toast Notification Component:** `src/components/theme/ThemeAwareToast.tsx`
  - Use style variables for color, shadow, and spacing.
- [ ] **3.2.3 Create Storybook Stories for Theming:** `src/stories/Theme.stories.tsx`
  - **State 1 (Light Mode):** Display components in light mode.
  - **State 2 (Dark Mode):** Display components in dark mode.
- [ ] **3.2.4 Ensure all UI components (navbar, sidebar, footer, etc.) use CSS variables (e.g., `var(--primary)`, `var(--background)`, `var(--radius)`) as defined in `styles.css`.

---

## 4. Final Build Step for Frontend Layout, Auth, and Styling

- [ ] **4.1 Execute Final Build:** Run `npm run build` to compile the project and ensure that the layout, authentication, and styling integrate seamlessly.
