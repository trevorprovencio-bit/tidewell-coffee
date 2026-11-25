# Tidewell Coffee website: development plan

Draft for Trevor's review, Nov 25, 2026. Nothing in here is built yet. Prices were read on the linked pages on Nov 25 and can change.

## The short version

- **Store:** WooCommerce runs the shop (bags of coffee now, more later). That means WordPress, so the site moves off GitHub Pages to a PHP host. Hostinger is the suggested pick, since Trevor already uses it.
- **Square account:** Tidewell gets its own Square account, separate from Bodega's (Trevor, Nov 25).
- **Payments and stock:** the official WooCommerce Square plugin takes card, Apple Pay and Google Pay payments into Square, and keeps products, prices and stock in sync. Square is the system of record, so the bags on the Bodega shelf and the bags sold online come out of one count.
- **Catering:** the catering page keeps its design, and the placeholder quote form is swapped for the Flashquotes intake form. Flashquotes only captures leads and builds quotes; every deposit, invoice and payment goes through Square (Trevor's call, Nov 25).
- **Menu:** the menu page rework toward Ephraim's sample menu is happening separately, in its own pull request. This plan only plans around it.

## Where the site is today

Read from the repo and from Trevor's earlier Claude Code sessions ("Homepage design inspiration" and "Design system", both Nov 25). What those sessions decided is marked as such.

- **Static site on GitHub Pages:** plain HTML, `base.css` and `base.js`, no build step. Pages: home, cafe menu, catering, visit, the San Marcos and Oceanside location pages, a product page, privacy, terms and a 404.
- **Shop is a mock:** `base.js` holds the four coffees (Signature Blend, Dreamy Dayz, Costa Sur, Decaf, all $22 for 12 oz) and a bag drawer with a Checkout button that goes nowhere. `product.html` reads the coffee from the URL.
- **Catering page is built:** navy hero, three steps, three services, FAQ and a placeholder form. The code already says the form will be replaced by the Flashquotes intake form.
- **Decided in "Homepage design inspiration":** nav split into two groups around the centred logo (Shop coffee, Cafe menu, Catering on the left; Visit, Our story, Contact and the Bag on the right). Both location pages got a navy "menu board" with dotted price leaders and line art.
- **Decided in "Design system":** the Tidewell design system now has a golden-ratio type scale (`font-size-10` to `font-size-110`, each 16 × φ^(n/2)), `phi` ratio tokens and logo construction rules. The WordPress theme should use those tokens rather than new values.
- **Build status:** the deploy of commit `6cfae0a` (the split nav) failed on Nov 25 with a server error on GitHub's side. The empty commit pushed afterwards (`5a01293`) didn't start a new run, so the live site still shows the version before the split nav. Re-running the failed job from the repo's Actions tab should publish it. This goes away once the site leaves GitHub Pages, but it's worth fixing now so the current site is right while the store is built.

## Architecture

```
Square (system of record)
  catalog, prices, stock, payments, orders
        │  WooCommerce Square plugin (sync on a schedule + payments)
        ▼
WordPress + WooCommerce on Hostinger
  Tidewell theme (ported from this repo's HTML/CSS)
  shop, product, cart, checkout, account
  menu, catering, visit, location and story pages
        │  Flashquotes embed on the catering page
        ▼
Flashquotes (catering leads and quotes only, no payments)
        │  accepted quote
        ▼
Square Invoices (deposit, then balance)
```

### Why one WordPress site rather than a static site plus a separate shop

Keeping the static pages and bolting WooCommerce on at a subdomain is possible, but it means two codebases, two navs and a cart that can't show in the header on the static pages. Porting the pages into one WordPress theme keeps one domain, one header with a live Bag count, and one place to edit. The HTML and CSS here are already clean, so the port is mostly cutting it into theme templates.

The theme still lives in this GitHub repo, and Hostinger deploys it from GitHub on every push to `main`, so the workflow stays the same: branch, pull request, merge, live.

### Square sync, in detail

From the plugin's own pages ([listing](https://wordpress.org/plugins/woocommerce-square/), [sync settings](https://woocommerce.com/document/square/sync-settings/)):

- **Who makes it:** WooCommerce and Automattic, open source, 80,000+ active installs, last updated three weeks ago. Its WordPress.org rating is 2.1 of 5 from 122 reviews, mostly complaints about sync, so we test it hard on a Square sandbox before launch.
- **System of record:** either side can be. We set **Square**, because the Bodega counter and the cart already sell through Square. Changes made in Square (name, price, description, images, categories, stock) pull into WooCommerce.
- **Timing:** WooCommerce checks Square on an interval we set. A bag sold at the counter shows up online at the next check, not instantly, so we keep a small buffer on low stock.
- **Rules it needs:** every synced item needs a unique SKU in Square, and stock edited by hand in WooCommerce gets overwritten. So stock is only ever changed in Square.
- **Payments:** card, Apple Pay and Google Pay through Square, with saved cards for returning customers.
- **Orders:** sending online orders to Square with fulfilment details is an option that's off by default. We turn it on so online orders land in Square. Whether they show on the Bodega POS screen needs testing on the real account, as the docs don't say.

Grinds (whole bean, drip, espresso and so on) become variations of each coffee in Square, each with its own SKU, so the grind picker on the product page maps straight across.

### Hosting

Hostinger's WordPress plans support WooCommerce ([WordPress hosting](https://www.hostinger.com/wordpress-hosting), [pricing](https://www.hostinger.com/pricing)). On Nov 25 the Black Friday prices were:

| Plan | Intro price | Renews at | Term |
|---|---|---|---|
| Premium | $1.99/mo ($95.52 upfront) | $10.99/mo | 48 months |
| Unlimited | $2.79/mo ($133.92 upfront) | $16.99/mo | 48 months |
| Cloud Startup | $7.99/mo ($383.52 upfront) | $25.99/mo | 48 months |

The comparison table lists ecommerce features as not available on Premium and included on Unlimited and Cloud Startup, so **Unlimited is the floor** for the store. If Trevor already has a Hostinger plan with room for another site, it may cost nothing extra. Those prices are a time-limited sale.

## Costs

| Piece | Cost | Where it came from |
|---|---|---|
| WordPress and WooCommerce | No licence fee (open source) | WordPress.org |
| WooCommerce Square plugin | No price shown; listed as open source | [Plugin listing](https://wordpress.org/plugins/woocommerce-square/) |
| Hosting | From $2.79/mo intro on Unlimited, $16.99/mo on renewal | [Hostinger pricing](https://www.hostinger.com/pricing) |
| Square online payments | 2.9% + 30¢ per online API payment (all plans); extra 1.5% on international cards | [Square fees](https://squareup.com/help/us/en/article/5068) |
| Flashquotes | Free plan, or Plus $49, Pro $99, Scale $199 a month billed annually; 14-day trial | [Flashquotes pricing](https://flashquotes.com/pricing) |
| Catering invoices (Square) | 2.9% + 30¢ per paid invoice on Square Plus or Premium, 3.3% + 30¢ on Square Free | [Square fees](https://squareup.com/help/us/en/article/5068) |
| Flashquotes payments | Not used. Its 3% platform fee and Stripe processing only apply to payments taken in Flashquotes | [Flashquotes pricing](https://flashquotes.com/pricing) |
| Domain | tidewellcoffee.com is Tidewell's; a transfer to Hostinger normally includes a year's renewal at its .com price, not checked yet | Trevor, Nov 25 |

Nothing here has been bought or signed up for.

## Catering quotes (Flashquotes)

"Flash quotes" on the call matches **Flashquotes** ([flashquotes.com](https://flashquotes.com/for/coffee)), booking and quoting software for mobile businesses with a page aimed at coffee carts. The catering page in this repo already names it, so this looks like the product Trevor meant.

What it does, from its own pages: a lead intake form you embed on your site or share as a link, instant quotes, deposits collected at booking, invoices, scheduling and a client list. Website embed widgets are on every plan, including the free one.

**Decided (Trevor, Nov 25, voice call, fillers removed):** "everything should be run through Square, so invoicing and all of that. Flashquotes would just be the tool to help people get into the sales funnel." So Flashquotes handles the form, the quote and the follow-up, and its payment features stay switched off.

Plan:

1. Build the intake form in Flashquotes with the same fields as the placeholder: name, email, phone, event date, guest count, event type, what they want (coffee bar, sandwiches, juices, deli sides), venue and notes.
2. Paste its embed code into the catering template where the placeholder form is, and style it to match.
3. Set up the coffee bar packages and pricing in Flashquotes so quotes go out without retyping.
4. Leave Flashquotes' deposit and online payment features off (they run on Stripe), and word its quote emails so the next step is a Square invoice, not a pay button.
5. When a client accepts a quote, send a Square invoice for the deposit, then one for the balance before the event. That matches the FAQ already on the catering page. The client and the event go into Square's customer directory, so catering sales sit alongside shop and cart sales.
6. Connect Google Calendar and GA4 (both listed as Flashquotes integrations) so bookings land on the calendar and quote requests count as conversions.

Flashquotes lists no Square integration, so the hand-off from an accepted quote to a Square invoice is a manual step at first. If catering volume grows, Zapier (a listed Flashquotes integration) could create the Square customer or a draft invoice when a quote is accepted. That's untested.

## Menu page

Pull request #1 is reworking `menu.html` toward Ephraim's sample menu: two columns, dotted leaders, and the full drink list with matcha, specialty lattes, teas and refreshers, add-ons and whole bean coffee. This plan doesn't touch that file.

Once it merges, the menu becomes a WordPress page template with the same markup. The cafe menu is for drinks made at the cart and in the shop, so it stays content on the site and isn't sold through WooCommerce. The whole bean section can link each coffee to its shop page.

Worth checking while that lands: the sample menu lists the whole bean coffees as Dreamy Dayz (Honduras), Signature Blend (Costa Rica) and Decaf (Mexico Chiapas), while the shop data in `base.js` also has Costa Sur (Mexico). Square's catalog should have the final lineup before sync goes live.

## Phases

### Phase 0: fix and decide (this week)
- Re-run the failed GitHub Pages deploy so the split nav goes live.
- Merge the menu page pull request (#1) once it's reviewed.
- Trevor answers the open questions below.

### Phase 1: set up the foundations
- **Trevor: move tidewellcoffee.com to Hostinger.** The domain is Tidewell's and currently sits in another account at its current registrar. A transfer needs:
  - the domain unlocked at the current registrar, and privacy protection off if it blocks the transfer;
  - the transfer authorisation (EPP) code from the current registrar, entered when starting the transfer in Hostinger;
  - the registrant email reachable, since the approval mail goes there;
  - a copy of the existing DNS records first (MX and TXT for email, any verification records), so email and anything else on the domain keeps working once Hostinger's nameservers take over;
  - the domain not registered or transferred in the last 60 days, which blocks a transfer.
  Transfers usually take a few days. The site can launch on the domain before it finishes by pointing DNS at Hostinger.
- Hosting plan and a WordPress install on a staging address.
- A Square sandbox app for testing, then Tidewell's own Square account (separate from Bodega's).
- Set up the coffees in Square with grind variations, SKUs, prices, images and stock.

### Phase 2: theme port
- Turn the current pages into a WordPress theme in this repo: header and footer from `base.js`, the design tokens from `base.css` and the design system, then each page as a template.
- Style the WooCommerce shop, product, cart, checkout and account pages to match the existing product page and bag drawer.
- Hostinger deploys the theme from GitHub on each push to `main`.

### Phase 3: store and sync
- Install WooCommerce and the Square plugin, set Square as the system of record, import the catalog, turn on stock sync and order sync.
- Shipping rates, local pickup at Bodega, tax settings, order and shipping emails.
- Test orders on the sandbox: card, Apple Pay, Google Pay, a refund, a counter sale that drops online stock.

### Phase 4: catering
- Build the Flashquotes intake form and packages with payments off, embed it, connect Google Calendar and GA4.
- Run one test end to end: form, quote, accepted quote, Square deposit invoice, Square balance invoice.

### Phase 5: launch
- Point tidewellcoffee.com at the WordPress site, install SSL, redirect the old GitHub Pages addresses.
- One real order with a real card, refunded.
- Update privacy and terms for online sales, then switch GitHub Pages off.

## Open questions for Trevor

1. **What sells online at launch:** just the coffee bags, or also merch, gift cards or subscriptions?
2. **Shipping or pickup:** ship bags, offer pickup at Bodega and the cart, or both?
3. **Hosting:** use an existing Hostinger plan, or start a new one for Tidewell?

## Suggestions (for Trevor to pick from, not decisions)

These are ideas, not part of the plan above. Pick any, or none.

- **Coffee subscriptions:** monthly bags are the most natural repeat sale for a roaster. The Square plugin supports WooCommerce Subscriptions, which is a paid extension I haven't priced.
- **Pickup at Bodega and the cart:** "order online, grab it with your latte" costs nothing to ship and brings people into the shop.
- **Real hours for San Marcos:** `base.js` still shows "Hours to be added" for the cart.
- **Local search:** add LocalBusiness structured data for both locations and keep the Google Business profiles matching the site's hours and addresses.
- **Lighter photos:** a few full-size photos in `assets/photos` are close to 1 MB each. Serving the `web/` versions everywhere, plus WebP, would speed up phones.
- **Email signup:** a short "new roast" list in the footer, so launch day has people to tell.
- **Wholesale page:** a simple form for cafes and offices that want Tidewell beans.
- **Gift cards:** Square gift cards already work at the counter. Worth checking whether they can be sold and redeemed online through the plugin too.
- **Analytics from day one:** GA4 with the checkout and quote request counted as conversions.
- **Legal check:** privacy and terms pages should be reviewed once the site takes payments and stores customer details.
