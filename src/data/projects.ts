export type ProjectLinks = {
  github?: string;
  githubFrontend?: string;
  githubBackend?: string;
  live?: string;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  technologies: string[];
  features: string[];
  implementation: string[];
  links: ProjectLinks;
  status: "live" | "completed" | "in-progress";
  featured: boolean;
  builtWithClaude?: boolean;
  category: "Full Stack / Mobile" | "AI / Full Stack" | "Full Stack" | "Full Stack CRUD" | "Frontend";
  image: string;
};

// Content verified directly against github.com/NIRMALKANDEL repositories
// (package.json + source tree) and the resume. No invented features,
// metrics, or URLs. Ordered by completeness and quality, strongest first.
export const projects: Project[] = [
  {
    slug: "paylog",
    title: "Paylog",
    tagline: "A personal finance tracker for Android, iPhone and the web, with a home-screen quick-note widget",
    description: "A personal finance tracker with a Flask + SQLite backend that serves both the website and a JSON API (/api/v1), and a native Android + iOS app built with React Native and Expo. Users log expenses and income, set budgets and savings goals, schedule recurring transactions, scan payment receipts, and add entries in plain text like \"250 lunch\", including straight from a home-screen widget without opening the app. Built using Claude AI.",
    problem: "Know where your money goes, with logging fast enough to actually keep up. Paylog is the next version of Spendly: a real native mobile app, a home-screen widget, and sign-ins that last 30 days, fixing the old app's habit of logging Android users out.",
    technologies: [
      "Python",
      "Flask",
      "SQLite",
      "Jinja",
      "Chart.js",
      "Tesseract.js",
      "React Native",
      "Expo",
      "Expo Router",
      "TypeScript",
      "Kotlin",
      "pytest",
      "GitHub Actions",
    ],
    features: [
      "Accounts: register, sign in, forgot/reset password by email, email confirmation, change email/password, CSV + full JSON backup export, delete account",
      "Expenses and income with categories, search, filter, sort and CSV import",
      "Budgets (overall + per category), savings goals and recurring transactions",
      "Analytics with charts and plain-language insights",
      "5 calculators: savings growth, goal planner, time to goal, emergency fund and loan EMI",
      "Quick note: type \"250 lunch\", \"salary 65000\" or \"2k rent yesterday\", one entry per line, with a live preview",
      "Android home-screen widget: a note card that saves entries without opening the app, with Undo and offline queueing",
      "Receipt scanning for GPay / PhonePe / Paytm / BHIM screenshots and bills, read on the phone",
      "Light / dark / system mode, 6 colour themes and 7 currencies (₹ with Indian grouping)",
    ],
    implementation: [
      "Flask backend split into routes (auth, transactions, budgets, goals, recurring, receipts, analytics, settings, api) and services; one server powers the website and the /api/v1 JSON API the mobile app uses.",
      "Mobile app (Expo SDK 57, React Native 0.86, Expo Router, TypeScript) stores a random 30-day sign-in token in Android Keystore / iOS Keychain that renews on every use; the server keeps only a SHA-256 hash of each token.",
      "A custom Expo module written in Kotlin powers the Android widget's note card and background sync, so offline notes are sent later and keep the day they were written.",
      "Receipt text is read on-device (Google ML Kit / Apple Vision on mobile, Tesseract.js on the web); an optional mode can read receipt images with Claude, and every field is re-validated before the user confirms.",
      "Backend tested with pytest; GitHub Actions CI runs the backend tests plus the mobile TypeScript typecheck and lint on every push.",
    ],
    links: {
      github: "https://github.com/NIRMALKANDEL/Paylog",
      live: "https://devnirmal.pythonanywhere.com",
    },
    status: "live",
    featured: true,
    builtWithClaude: true,
    category: "Full Stack / Mobile",
    image: "/projects/paylog.svg",
  },
  {
    slug: "devtinder",
    title: "DevTinder",
    tagline: "A Tinder-style networking app for developers, live at projectdev.in",
    description: "A full-stack developer-networking app where developers discover and connect with each other. The React 19 + Redux Toolkit frontend talks to a Node.js/Express REST API on MongoDB Atlas, with email verification, password reset and transactional emails sent through AWS SES. Both run on one AWS EC2 instance behind nginx and Cloudflare.",
    problem: "Ship a real two-sided MERN product, not a demo: secure auth with verified emails, a swipe feed, a request and connection workflow, and transactional email on a custom domain, split across separate frontend and backend repositories.",
    technologies: [
      "React 19",
      "Vite 6",
      "Redux Toolkit",
      "React Router 7",
      "Tailwind CSS",
      "daisyUI 5",
      "Node.js",
      "Express 4",
      "MongoDB Atlas",
      "Mongoose 8",
      "JWT",
      "bcryptjs",
      "AWS SES",
      "AWS EC2",
      "nginx",
      "pm2",
      "Cloudflare",
    ],
    features: [
      "Sign up, login and logout with a JWT stored in an httpOnly cookie",
      "Email verification: login is blocked until the link in the welcome email is clicked",
      "Forgot / reset password with a one-time link valid for 15 minutes",
      "Transactional emails through AWS SES: welcome, reset, new interest and accepted request",
      "Feed of developers you haven't interacted with, marked Ignore or Interested",
      "Accept or reject incoming requests, and a list of your connections",
      "Edit profile with a live card preview",
      "Loading skeletons, empty states, page transitions and reduced-motion support",
    ],
    implementation: [
      "Backend: Express app with routes for auth, profile, request and user, a userAuth middleware that reads the JWT cookie, and Mongoose models for users and connection requests.",
      "Emails are sent with the AWS SDK v3 SES client from no-reply@projectdev.in; DKIM records in Cloudflare prove the mail is genuine.",
      "Frontend: React 19 + Vite with Redux Toolkit slices for user, feed, requests and connections, styled with Tailwind CSS and daisyUI.",
      "Deployed on AWS EC2: nginx serves the built frontend and proxies /api to the Node server run by pm2; the domain is registered at GoDaddy with DNS and proxy on Cloudflare.",
    ],
    links: {
      githubFrontend: "https://github.com/NIRMALKANDEL/devTinder-web",
      githubBackend: "https://github.com/NIRMALKANDEL/devTinder",
      live: "https://www.projectdev.in",
    },
    status: "live",
    featured: true,
    category: "Full Stack",
    image: "/projects/devtinder.svg",
  },
  {
    slug: "nibblr",
    title: "Nibblr",
    tagline: "A food-delivery app covering the full ordering flow",
    description: "A food-delivery web app built with React 18, Redux Toolkit and Tailwind CSS. Users discover restaurants with search, filters and sorting, browse menus, manage a persistent cart, check out with an interactive delivery-address map and coupon codes, and view their order history, backed by live restaurant data with an offline-friendly sample-data fallback.",
    problem: "Build a complete, resilient ordering experience on the frontend alone, real third-party data that can fail at any time, a cart and orders that survive reloads, and a checkout that feels real without a backend.",
    technologies: [
      "React 18",
      "Redux Toolkit",
      "React Router",
      "Tailwind CSS",
      "Leaflet / OpenStreetMap",
      "Parcel",
      "Jest",
      "React Testing Library",
    ],
    features: [
      "Restaurant search with combinable filters (rating, pure veg, fast delivery), sorting and cuisine chips",
      "Location picker using browser geolocation or manual search",
      "Restaurant menus with a top-picks carousel and a veg-only toggle",
      "Cart with live subtotal / fees / GST breakdown, persisted to localStorage",
      "Checkout with a Leaflet map address picker, coupon validation and a mock COD / card payment flow",
      "Order confirmation, order history and one-click reorder",
      "Favorites, recently viewed restaurants and a demo login gating checkout",
      "Shimmer loaders, offline banner, error boundary and 404 page",
    ],
    implementation: [
      "Redux Toolkit slices manage cart, favorites, orders and location; state is persisted to localStorage with every read/write wrapped in try/catch.",
      "Utils/api.js fetches live restaurant data directly, falls back through CORS proxies, and finally to bundled sample data with a visible banner, so the UI never gets stuck.",
      "Menu parsing handles both flat and nested category response shapes.",
      "Card details in the mock payment flow are format-validated (Luhn check, expiry, CVV) and then discarded, never stored or sent anywhere.",
      "Unit tests with Jest + React Testing Library; deployed on Vercel as a static SPA.",
    ],
    links: {
      github: "https://github.com/NIRMALKANDEL/Food-dilivery-app-",
      live: "https://nibblr-azure.vercel.app",
    },
    status: "live",
    featured: true,
    category: "Frontend",
    image: "/projects/nibblr.svg",
  },
  {
    slug: "netflix-gpt",
    title: "Netflix GPT",
    tagline: "A Netflix-style streaming UI with GPT-powered movie search",
    description: "A Netflix-inspired movie browsing app built with React and Firebase. Users sign in with Firebase Authentication, browse Now Playing / Popular / Top Rated / Upcoming titles pulled from the TMDB API, watch trailers, and use an AI-powered search bar (built on Google's Gemini API) to get movie recommendations from natural-language queries.",
    problem: "Recreate a production-grade streaming UI end-to-end, auth, live movie data, and an AI layer on top, rather than a static clone.",
    technologies: [
      "React 19",
      "Redux Toolkit",
      "React Router",
      "Tailwind CSS",
      "Firebase Auth",
      "TMDB API",
      "Google Gemini AI",
    ],
    features: [
      "Firebase Authentication (sign up, login, protected routes)",
      "Browse Now Playing, Popular, Top Rated & Upcoming movies via TMDB API",
      "AI-powered movie search using Google's Gemini API",
      "Trailer playback for movies and search results",
      "Redux Toolkit for global state (auth, movies, GPT search, UI config)",
      "Responsive, Netflix-style browse UI with header, hero banner and rows",
      "Static Help Center / Terms / Legal Notices pages",
    ],
    implementation: [
      "Custom hooks (useNowPlayingMovies, usePopularMovies, useTopRatedMovies, useUpcomingMovies, useMovieTrailer) fetch and cache TMDB data into Redux slices.",
      "geminiAi.js wraps the Gemini API call for the GPT search bar and formats the response into a movie list.",
      "firebase.js initializes Firebase Auth; auth state is synced into a userSlice and gates the Browse route.",
      "Deployed to Firebase Hosting via firebase.json / .firebaserc.",
    ],
    links: {
      github: "https://github.com/NIRMALKANDEL/netflix-gpt",
      live: "https://netflix-gpt-d8cfb.web.app",
    },
    status: "live",
    featured: true,
    category: "AI / Full Stack",
    image: "/projects/netflix-gpt.svg",
  },
  {
    slug: "brightway-solar",
    title: "Brightway Solar",
    tagline: "A lead-generation website for a solar company, with a chatbot",
    description: "A client-style MERN website for a (fictional) solar installation company, designed around lead generation. It has 13+ pages, a free-quote form on every key page, a savings calculator, a government-subsidy (PM Surya Ghar) page, and a chatbot that answers from real site data. Every enquiry is saved to MongoDB along with the page it came from.",
    problem: "Turn a basic template site into something that actually brings a local business customers, clear calls to action, plain-language pricing help, and instant answers for visitors.",
    technologies: [
      "React 18",
      "Vite",
      "React Router",
      "Tailwind CSS",
      "Axios",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "Nodemailer",
    ],
    features: [
      "13+ pages: Home, About, Products (list + detail), Services, Projects, Gallery, Government Schemes, Blog, Testimonials, FAQ, Contact",
      "\"Get Free Quote\" lead form on every key page, saved to MongoDB with its source page",
      "Savings calculator that explains the benefit in plain language",
      "Keyword-matching chatbot that answers from company info, products and FAQs, with an honest fallback",
      "WhatsApp button and mobile-first responsive layout",
      "Accessibility basics: semantic HTML, skip link, focus states, labelled forms, ARIA on widgets",
    ],
    implementation: [
      "Express REST API for leads, products, testimonials, projects, blog, FAQs, contact and the chatbot, with Mongoose models and a seed script.",
      "express-rate-limit protects form endpoints; Nodemailer is wired for new-lead email notifications.",
      "React + Vite frontend with React Router; the Vite dev server proxies /api to the backend.",
      "Company details are kept in one config file so the site can be rebranded for a real client.",
    ],
    links: {
      github: "https://github.com/NIRMALKANDEL/DUMMY-client-website-",
    },
    status: "completed",
    featured: false,
    category: "Full Stack",
    image: "/projects/brightway-solar.svg",
  },
  {
    slug: "nextjs-video-app",
    title: "Next.js Video App",
    tagline: "A full-stack Next.js video-sharing app with ImageKit uploads",
    description: "A full-stack video-sharing app built entirely in Next.js with TypeScript. Users register and log in with NextAuth, upload vertical videos to ImageKit, and browse a feed of the latest uploads. User and video data are stored in MongoDB through Mongoose, and routes are protected by middleware.",
    problem: "Learn full-stack Next.js end-to-end, auth, protected API routes, a database, and secure direct-to-CDN media uploads, in a single TypeScript codebase.",
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "NextAuth.js",
      "MongoDB",
      "Mongoose",
      "ImageKit",
      "bcrypt",
      "Tailwind CSS",
    ],
    features: [
      "Register and login with NextAuth credentials (bcrypt-hashed passwords)",
      "Middleware-protected pages and API routes",
      "Video upload to ImageKit with server-generated auth parameters",
      "Video feed sorted by newest, with title, description and thumbnail",
      "Vertical 1080×1920 video format with configurable quality",
    ],
    implementation: [
      "App Router API routes: /api/auth (register + NextAuth), /api/imageKit-auth (upload signatures) and /api/Video (GET feed, POST new video behind getServerSession).",
      "Typed Mongoose models (User, Video) with a shared database connection helper.",
      "next-auth middleware (withAuth) guards every route except login, register and auth endpoints.",
      "Work in progress, the core flow is built; UI polish and deployment are next.",
    ],
    links: {
      github: "https://github.com/NIRMALKANDEL/NEXT-project-imagekit",
    },
    status: "in-progress",
    featured: false,
    category: "Full Stack",
    image: "/projects/nextjs-video-app.svg",
  },
  {
    slug: "mern-todo",
    title: "MERN Todo",
    tagline: "A full-stack task manager with priorities, due dates, search and dark mode",
    description: "My first full-stack project, built to learn the MERN stack end to end: an Express 5 REST API with Mongoose validation and a React 19 frontend made of small components and custom hooks. Every action gives instant feedback, errors are handled on client and server, and it works from 375px phones to desktop.",
    problem: "Learn the full MERN loop properly: design a REST API, model and validate data, and build a React UI that stays fast and honest when the network fails.",
    technologies: ["React 19", "Vite", "Tailwind CSS 4", "Axios", "react-hot-toast", "Node.js", "Express 5", "Mongoose", "MongoDB Atlas"],
    features: [
      "Create, edit, complete and delete tasks, with inline editing (Enter to save, Esc to cancel)",
      "High / Medium / Low priorities and optional due dates with Today, Tomorrow and Overdue labels",
      "Filter tabs with live counts, instant search and sorting by newest, due date or priority",
      "Progress dashboard with a completion bar",
      "Optimistic updates that roll back if the server request fails",
      "Dark / light theme that follows the system and loads without a flash",
    ],
    implementation: [
      "A useTodos hook owns all task state and API calls, including optimistic updates with rollback; components only receive data and callbacks.",
      "One Axios instance with a response interceptor turns server errors into readable toasts.",
      "Express 5 forwards rejected promises to a central error middleware, so controllers need no repeated try/catch; request bodies are whitelisted.",
      "Client deployed on Vercel, API backed by MongoDB Atlas.",
    ],
    links: {
      github: "https://github.com/NIRMALKANDEL/mern-todo",
      live: "https://mern-todo-ashen.vercel.app",
    },
    status: "live",
    featured: false,
    category: "Full Stack CRUD",
    image: "/projects/mern-todo.svg",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}
