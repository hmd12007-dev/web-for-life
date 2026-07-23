# MediCore Hospital Website

A modern, professional, and fully responsive medical/hospital website built with pure HTML5, CSS3, and JavaScript — no frameworks required.

![MediCore Hospital](https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200&q=80)

## Live Demo

> Deploy this project to Vercel to get a live link. See the [Deployment Guide](#deployment) below.

---

## Features

### Pages (10 Total)
| Page | Description |
|------|-------------|
| **Home** | Hero section, animated stats, services preview, doctors preview, why choose us, testimonial slider, newsletter |
| **About** | Mission, vision, values, hospital history timeline, certifications |
| **Services** | 12 medical departments with descriptions, emergency CTA |
| **Doctors** | 8 specialist profiles with social links and ratings |
| **Gallery** | 12-image lightbox gallery with category filtering |
| **Pricing** | Consultation packages + annual health programs |
| **Testimonials** | Auto-playing slider + grid of patient stories |
| **FAQ** | Accordion-style Q&A across 5 categories |
| **Contact** | Validated form, Google Maps embed, contact info |
| **404** | Custom branded error page with quick navigation |

### UI/UX Features
- **Responsive Design** — Mobile, tablet, and desktop optimized
- **Dark / Light Mode Toggle** — Persisted via localStorage
- **Preloader / Loading Animation** — Progress bar animation on page load
- **Sticky Navbar** — Scrolled effect with backdrop blur
- **Mobile Menu** — Hamburger toggle with smooth open/close
- **Hero Section** — Animated blobs, floating cards, CTA buttons
- **Animated Statistics** — IntersectionObserver counter animation
- **Testimonial Slider** — Auto-play, touch swipe, keyboard navigation
- **Gallery Lightbox** — Click to expand, prev/next, keyboard support
- **Gallery Filtering** — Category filter tabs
- **FAQ Accordion** — Smooth open/close with active state
- **Contact Form** — Full client-side validation with error messages
- **Google Maps Embed** — Hospital location iframe
- **Newsletter Form** — Email validation with success feedback
- **Back-to-Top Button** — Scroll-aware visibility
- **AOS Animations** — Scroll-triggered fade/slide animations
- **Smooth Scrolling** — CSS + JS anchor navigation

### Technical
- **SEO Meta Tags** — Title, description, keywords, Open Graph on all pages
- **ARIA Accessibility** — Roles, labels, live regions throughout
- **Optimized Images** — Lazy loading, Unsplash CDN with size params
- **Clean CSS Architecture** — CSS custom properties, responsive grid
- **No Build Tools Required** — Plain HTML/CSS/JS, opens in any browser

---

## Project Structure

```
medicore-hospital/
├── index.html              # Home page
├── 404.html                # Custom 404 error page
├── README.md               # This file
├── css/
│   └── style.css           # All styles (variables, components, responsive)
├── js/
│   └── main.js             # All JavaScript (theme, navbar, slider, FAQ, etc.)
├── images/
│   └── favicon.svg         # Hospital favicon
└── pages/
    ├── about.html          # About page
    ├── services.html       # Services/departments page
    ├── doctors.html        # Doctor profiles page
    ├── gallery.html        # Photo gallery page
    ├── pricing.html        # Pricing packages page
    ├── testimonials.html   # Patient testimonials page
    ├── faq.html            # FAQ accordion page
    └── contact.html        # Contact form + map page
```

---

## Getting Started

### Option 1 – Open Directly
No server needed for most features. Just open `index.html` in any modern browser:
```
double-click index.html
```

### Option 2 – Local Dev Server (Recommended)
For the best experience (avoids CORS issues with the map):

**Using VS Code Live Server:**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html` → "Open with Live Server"

**Using Node.js:**
```bash
npx serve medicore-hospital
# or
npx http-server medicore-hospital
```

**Using Python:**
```bash
cd medicore-hospital
python -m http.server 8000
# Open http://localhost:8000
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MediCore Hospital website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/medicore-hospital.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click **"New Project"** → Import your repository
   - Framework Preset: **Other** (static site)
   - Root Directory: `medicore-hospital` (or root if that's your repo root)
   - Click **Deploy**
   - Your site is live at `https://medicore-hospital.vercel.app` (or similar)

3. **Custom 404 page on Vercel:**
   Create a `vercel.json` in the project root:
   ```json
   {
     "routes": [
       { "handle": "filesystem" },
       { "src": "/(.*)", "dest": "/404.html", "status": 404 }
     ]
   }
   ```

### Deploy to GitHub Pages

1. Push code to a GitHub repository
2. Go to repository **Settings** → **Pages**
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Save — your site will be at `https://USERNAME.github.io/REPO_NAME/`

---

## Customization

### Change Hospital Name / Branding
- Find and replace `MediCore` in all HTML files with your hospital name
- Update contact details (address, phone, email) in each page's footer and contact page
- Replace the Google Maps embed URL in `pages/contact.html` with your actual location

### Change Colors
Edit CSS variables in `css/style.css`:
```css
:root {
  --primary: #0d6efd;        /* Main brand color */
  --secondary: #20c997;      /* Accent green */
  --accent: #fd7e14;         /* Orange accent */
}
```

### Add/Remove Pages
1. Create a new HTML file in `/pages/`
2. Copy the navbar and footer HTML from any existing page
3. Add a link to the new page in every navbar's `<ul class="navbar-nav">` and mobile menu

### Replace Images
All images are loaded from Unsplash CDN. To use local images:
1. Place images in the `/images/` folder
2. Update `src` attributes to relative paths like `../images/your-image.jpg`

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Safari | ✅ Full |
| Chrome Android | ✅ Full |

---

## Dependencies (CDN — No Installation Required)

| Library | Purpose | Version |
|---------|---------|---------|
| [Font Awesome](https://fontawesome.com) | Icons | 6.5.0 |
| [AOS.js](https://michalsnik.github.io/aos/) | Scroll animations | 2.3.1 |
| [Google Fonts](https://fonts.google.com) | Inter + Poppins fonts | latest |

---

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).  
Free to use, modify, and distribute for personal and commercial projects.

---

## Credits

- **Images:** [Unsplash](https://unsplash.com) (free to use under Unsplash License)
- **Icons:** [Font Awesome](https://fontawesome.com) Free tier
- **Animations:** [AOS.js](https://michalsnik.github.io/aos/) by Michał Sajnóg
- **Fonts:** [Google Fonts](https://fonts.google.com) — Inter & Poppins

---

*Built with care for the healthcare community.*
