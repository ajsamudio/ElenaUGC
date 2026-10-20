# Brand Inbox → Google Sheet: Setup

Your brand emails show up in a Google Sheet, sorted into **💰 Paid / 🎁 Gifting / 🔗 Affiliate / 🚫 Spam**, with the $ amount pulled out. Each brand gets a draft reply with your rates, ready for you to review and send. Everything runs inside your own Google account, and nobody else sees your email.

Setup takes about 5 minutes and only has to be done once.

## 1. Create the Sheet
1. Go to **sheets.new** to create a blank Google Sheet. Name it something like "Brand Inbox".
2. In the top menu, click **Extensions → Apps Script**. A code editor opens in a new tab.
3. Delete everything in the editor and paste in the full contents of `Code.gs`.
4. Click the 💾 **Save** icon.

## 2. Allow it
1. Go back to the Sheet tab and **refresh the page**. After a few seconds, a **📬 Inbox** menu appears at the top.
2. Click **📬 Inbox → Set up tabs**.
3. Google asks for permission:
   - Click **Continue**, then choose your account.
   - You'll see "Google hasn't verified this app". This is normal, because it's your own script. Click **Advanced → Go to (project name)**.
   - Click **Allow**. The script can now read your Gmail, send replies and edit this Sheet, all within your account.
4. You now have two tabs: **Inbox** and **Settings**.

## 3. Fill in Settings (important)
On the **Settings** tab:
- Fill in the `$___` blanks in **Reply Paid / Reply Gifting / Reply Affiliate** with your real rates.
- For each **Auto-reply** setting, choose one of:
  - **YES**: sends the reply automatically
  - **DRAFT**: saves the reply in Gmail Drafts so you can review it and hit send
  - **NO**: does nothing

  Everything defaults to **DRAFT**, so nothing is sent without you seeing it first.
- Add or remove keywords whenever you want. The changes apply on the next refresh.

## 4. Use it
- **📬 Inbox → Refresh now**: pulls in brand emails from the last 30 days.
- **📬 Inbox → Scan older emails**: fills in the last 12 months. This never auto-replies to old emails. If it says "not finished yet", click it again.
- **📬 Inbox → Turn ON auto-refresh**: checks every hour, even when the Sheet is closed.
- Use the filter arrows in the header row to sort by **$ Amount** or show only **💰 Paid**.
- Click **open** on any row to jump to that email.

In Gmail, sorted emails also get labels: **Brand Deals/Paid**, **Brand Deals/Gifting**, and so on.

## Good to know
- Each brand gets at most **one** auto-reply, and only if you haven't replied to them yet.
- The $ amount is a best guess. "Budget $500–$2,000" shows $2,000, and amounts near "value" or "retail" are ignored. Always read the actual email for paid offers.
- Emails that aren't brand-related, like personal email and receipts, are skipped. So are newsletters, promos and anything in the Promotions / Social / Updates tabs.
- If a real brand pitch ever gets missed, check the Promotions tab. You can remove `-category:promotions` from **Gmail search** in Settings, or set **Skip newsletters** to NO.
- To stop it completely, use **📬 Inbox → Turn OFF auto-refresh**.
