# NEXTDROP — Catalogue Website

**Your next favourite find.**

This is your complete catalogue website: homepage, searchable shop, 8 category pages, a page for every product, How to Order, policy pages and a protected admin panel at `/admin` for managing products without touching code.

- **No checkout, cart, accounts or payments.** Customers browse, then tap **Order on WhatsApp** (the message is pre-filled with the product reference, name, chosen size and colour) or **Message on Telegram**.
- **Hosting:** Netlify (free plan to start). **Product storage:** your own GitHub repository. Every admin save is stored permanently and the site republishes itself automatically.
- **Admin protection:** only GitHub accounts you give access to can sign in and edit. Customers can't.

---

## 1. One-time setup (about 20–30 minutes)

You need two free accounts: **GitHub** (stores your website and products) and **Netlify** (puts it online).

### Step 1 — Put the files on GitHub
1. Create a free account at **github.com**.
2. Click **+ → New repository**. Name it `nextdrop`, choose **Private**, and click **Create repository**.
3. On the new repository page, click **uploading an existing file**.
4. Unzip `nextdrop-website.zip` on your computer. Open the `nextdrop` folder, select **everything inside it** (the `content`, `scripts`, `src` and `static` folders plus `package.json`, `netlify.toml`, `README.md` and `.gitignore`) and drag it all into the upload area. Use Chrome or Edge on a computer, because folders can't be uploaded from a phone.
5. Click **Commit changes**.

### Step 2 — Tell the admin panel which repository to use
1. In GitHub, open `static/admin/config.yml` and click the ✏️ pencil icon.
2. Change the line
   `repo: YOUR-GITHUB-USERNAME/nextdrop`
   to your real username, e.g. `repo: dean-nextdrop/nextdrop`.
3. Click **Commit changes**.

### Step 3 — Publish on Netlify
1. Go to **netlify.com**, then **Sign up → Sign up with GitHub**.
2. Click **Add new project → Import an existing project → GitHub**, and allow Netlify to access the `nextdrop` repository.
3. Netlify reads the settings automatically (build command `npm run build`, publish directory `dist`). Click **Deploy**.
4. After 1–2 minutes your site is live at an address like `https://something-random.netlify.app`. You can rename it under **Project configuration → Change project name** (e.g. `nextdrop-uk.netlify.app`).

### Step 4 — Switch on admin login
1. In GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App**. (Settings here means your profile settings: click your photo, top right.)
   - **Application name:** NEXTDROP Admin
   - **Homepage URL:** your Netlify address, e.g. `https://nextdrop-uk.netlify.app`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
2. Click **Register application**, then **Generate a new client secret**. Keep this page open.
3. In Netlify, open your project, then **Project configuration → Access & security → OAuth → Install a provider → GitHub**. Paste the **Client ID** and **Client secret**, then click **Install**.
4. Visit `https://YOUR-SITE.netlify.app/admin/` and click **Login with GitHub**. You're in.

> Netlify sometimes renames menu items. If you can't find the OAuth setting, search Netlify's docs for "OAuth authentication provider GitHub".

---

## 2. Before you launch: checklist

The preview contains **13 DEMO products**. They're labelled DEMO everywhere, and a yellow notice runs across the top of every page. Replace them before sharing the site.

- [ ] **Add the Telegram link.** Admin → **Site settings** → *Telegram link* (e.g. `https://t.me/yourusername`). Telegram buttons stay hidden until this is filled in.
- [ ] Add your **Instagram link** and, optionally, a **contact email**.
- [ ] **Policies:** Admin → **Policies & pages**. Replace every highlighted *"To complete"* item (courier, returns address, payment methods, trading name and so on) with accurate information. These are starting templates, not legal advice.
- [ ] **Add your real products** (section 3).
- [ ] **Delete the demo products:** open each DEMO product → **Delete entry** (or switch on *Hide from website*). Then delete the `demo-…` photos in **Media**.
- [ ] Update **Featured products** in Site settings with your real references.
- [ ] Optional: upload your own **homepage background image** (wide, dark photo works best).
- [ ] Once you have a domain, set **Website address** (section 6).

The build log on Netlify (**Deploys → latest deploy**) also lists anything still missing under *"Things to check"*.

---

## 3. Managing products (no code)

Go to `yoursite/admin/` → **Products**.

| To… | Do this |
|---|---|
| **Add a product** | **New Product**. Fill in reference (e.g. `ND014`), name, price, photos, description, categories, sizes, colours. Click **Publish → Publish now**. |
| **Upload photos** | In *Photos*, click **Add photo → Choose an image → Upload**. The first photo is the main image. Portrait photos (4:5, e.g. 1200×1500) look best; photos are cropped to 4:5 and compressed automatically. |
| **Edit name, description or price** | Open the product, change it, click **Publish**. |
| **Put it in several categories** | Tick more than one category. It's still one product with one page. |
| **Sizes / colours** | Enter **only sizes and colours you can confirm.** Leave empty if not applicable (e.g. a bag). Sizes are typed comma-separated: `S, M, L, XL`. |
| **Availability** | *Confirm when ordering* (default), *Available to order*, *Limited availability* or *Sold out*. Sold-out items change the button to **Ask about restock**. |
| **Mark as a new arrival** | Switch on **New arrival**. It appears in *New Drops* and on the homepage. |
| **Put on offer** | Switch on **On offer**. Optionally enter the genuine *original price*, which shows crossed out. It appears in *Offers & Special Deals*. |
| **Hide temporarily** | Switch on **Hide from website**. The product keeps its details but disappears from the site. |
| **Remove permanently** | Open it → **Delete entry**. |
| **Reorder featured products** | **Site settings → Featured products**. Drag the handles to reorder, add or remove items. |

Each **Publish** saves to GitHub instantly, and the live site updates **1–2 minutes** later.

**Tip:** make several changes, then publish. Each publish uses Netlify credits (section 8).

---

## 4. Changing the WhatsApp or Telegram links

Admin → **Site settings → Contact links, homepage & delivery**:

- **WhatsApp number:** international format without `+` or spaces, e.g. `447947942458`. Every WhatsApp button, including the pre-filled order messages, updates automatically.
- **Telegram link:** your official link, e.g. `https://t.me/yourusername` or a group or channel invite link.
- **Delivery fee:** currently £5. It updates everywhere it's shown.

### How the Telegram button works
Telegram has no reliable way for a website to pre-fill a message to a *specific* account. (Its "share" link makes the customer pick a chat, which could send the order somewhere else.) So when a customer taps **Message on Telegram**, the site:
1. **copies the order details** (reference, name, size, colour and the fields to fill in) to their clipboard, and shows "Order details copied — paste them into the Telegram chat", then
2. opens your Telegram chat.

The same details also appear on each product page under **Order details to send**, with a Copy button.

---

## 5. Links to share

Replace `yoursite` with your Netlify address or domain.

| Where | Link |
|---|---|
| **Instagram bio** | `https://yoursite/` |
| **Pinned Telegram message** | `https://yoursite/shop/` |
| **A single product** | `https://yoursite/nd001` (short link) or `https://yoursite/product/nd001/` |
| **A category** | `https://yoursite/shop/new-drops/` · `/shop/offers/` · `/shop/mens-clothing/` · `/shop/womens-clothing/` · `/shop/trainers-footwear/` · `/shop/watches-jewellery/` · `/shop/matching-sets/` · `/shop/accessories/` |

When a product link is shared on WhatsApp, Telegram, Instagram DMs or Facebook, the preview shows that product's **photo, name and price**. Other pages show your NEXTDROP logo.

> Apps cache previews. If you change a product photo after sharing its link, an old preview may show for a while. Facebook's **Sharing Debugger** can refresh it.

---

## 6. Connecting your own domain (e.g. nextdrop.co.uk)

1. Buy a domain from any registrar (e.g. Namecheap, GoDaddy, 123-reg, IONOS), or buy it inside Netlify.
2. In Netlify: **Domain management → Add a domain** and enter it.
3. Follow Netlify's instructions. Either point your domain's **nameservers** to Netlify (easiest), or add the **DNS records** it shows at your registrar.
4. Netlify adds HTTPS automatically (it can take up to 24 hours).
5. In GitHub → **Settings → Developer settings → OAuth Apps → NEXTDROP Admin**, change the *Homepage URL* to your new domain.
6. In Admin → **Site settings → Website address**, enter `https://www.yourdomain.co.uk` and publish. Share previews then use your domain.

---

## 7. Giving someone else admin access

In GitHub, open the repository → **Settings → Collaborators → Add people**. They log in at `/admin` with their own GitHub account. To remove access, remove them there.

---

## 8. Costs and limits (please read)

There are **no subscriptions in this setup**. GitHub (private repository) is free, Netlify has a free plan, and the admin (Decap CMS) is free and open-source. The only optional cost is a **domain name** (roughly £5–£15 a year for a .co.uk).

**Netlify's free plan limit:** Netlify gives **300 credits a month**. Each time the site republishes (every admin **Publish**) uses **15 credits**, and visitor traffic also uses credits (about 20 credits per GB). In practice that's roughly **15–20 publishes a month** plus normal traffic for a growing small shop. If credits run out, the site stays online but **new updates pause** until the next month.

- Batch your edits (add 5 products, then publish), rather than publishing after every small change.
- If you outgrow it, Netlify's **Personal plan (about $9/month)** gives 1,000 credits.
- Check usage under **Netlify → Team → Usage & billing**.

Prices are as of October 2026. Check netlify.com/pricing for the current figures.

---

## 9. How it works (for a developer)

```
content/
  products/*.json     ← one file per product (edited via /admin)
  pages/*.json        ← policy pages (markdown)
  settings.json       ← WhatsApp, Telegram, delivery fee, homepage, featured order
static/
  uploads/            ← product photos uploaded via /admin
  admin/              ← Decap CMS (index.html + config.yml)
  brand/ fonts/       ← logo, monogram, share image, self-hosted fonts
src/styles.css        ← design system
src/app.js            ← search, sort, size/colour selection, WhatsApp/Telegram, menu
scripts/build.mjs     ← generates the static site into dist/
```

- `npm install && npm start` builds and previews at http://localhost:4321.
- `npm run admin:local` (in a second terminal, with the preview running) lets you use `/admin` locally without GitHub login. Edits write straight to `content/`.
- The build generates responsive WebP images, 1200×630 JPG share images per product, Open Graph and Twitter tags, Product JSON-LD, `sitemap.xml`, `robots.txt`, short-link redirects (`/nd001`) and a 404 page.
- WhatsApp links use `https://wa.me/<number>?text=<URL-encoded message>`, which works on iPhone, Android and desktop (WhatsApp Web).
- Products with *Hide from website* switched on aren't built at all, so their URLs return the 404 page.

© NEXTDROP — Your next favourite find.
