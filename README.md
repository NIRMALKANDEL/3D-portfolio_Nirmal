# Nirmal Kandel, 3D Portfolio

Interactive 3D portfolio for **Nirmal Kandel**, Full Stack / MERN Developer. Built with Next.js, React Three Fiber, Motion and Tailwind CSS.

**Live site:** [nirmal-3d-portfolio.vercel.app](https://nirmal-3d-portfolio.vercel.app)

## Highlights

- **AI-coding 3D hero.** A neural-network core streams data packets into three floating code editors that type real code live (a Claude API call, the DevTinder login route, a React hook). Follows the cursor and fades on scroll.
- **3D project carousel.** Drag, swipe, use the arrow keys or click a card. The front project shows its live demo, frontend/backend repos and a case study link.
- **Case study pages** (`/projects/[slug]`). Browser mockup that flattens from 3D as you scroll, sticky table of contents, animated feature cards, a build timeline with scroll progress, and previous/next navigation.
- **Draggable 3D skills globe** alongside grouped skill lists.
- **Journey timeline.** Pins on desktop and pans sideways as you scroll, with coverflow-style 3D cards.
- **Cursor light.** A soft glow follows the pointer (mouse only, off for reduced motion).
- **Command palette** (`Ctrl/Cmd + K`) to jump to any page or project, copy the email or switch theme.
- Dark mode by default and a bright mint light mode. Every animation respects `prefers-reduced-motion`.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| 3D | Three.js, React Three Fiber, drei, canvas-texture editors |
| Motion | Motion (`motion/react`): springs, scroll-linked transforms, layout animation |
| Styling | Tailwind CSS v4, Geist and Geist Mono |
| Email | Resend (server-side contact form) |
| Hosting | Vercel |

## Project Structure

```
src/
  app/            # routes: /, /about, /projects, /projects/[slug], /experience,
                  # /education, /non-tech, /contact, /api/contact
  components/
    hero/         # hero + AI-coding 3D scene (hero-scene.tsx)
    projects/     # 3D carousel, cards, case study page
    skills/       # skills section + draggable skill globe
    journey/      # scroll-pinned horizontal timeline
    command/      # Ctrl/Cmd+K command palette
    ui/           # buttons, reveal, tilt card, cursor glow, scroll progress
  data/           # content: projects, skills, experience, education, timeline
public/
  projects/       # project preview images
  resume.pdf
```

Project content lives in `src/data/projects.ts` and is checked against each project's GitHub README.

## Local Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | [Resend](https://resend.com) API key for the contact form. Without it the form shows a "not configured" error. |
| `CONTACT_TO_EMAIL` | Inbox that receives messages. Defaults to the email in `src/data/site.ts`. |
| `CONTACT_FROM_EMAIL` | Sender address; must be a verified Resend sender or domain. |

## Deployment

Deployed on Vercel at **https://nirmal-3d-portfolio.vercel.app**. To deploy your own copy, import the repo at [vercel.com/new](https://vercel.com/new), add the environment variables above and deploy. No extra build configuration is needed.
