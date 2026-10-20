/**
 * Brand Inbox → Google Sheet
 * Pulls brand emails from Gmail into this Sheet, sorts them into
 * Paid / Gifting / Affiliate / Spam with keyword rules (no AI), pulls out
 * dollar amounts, labels them in Gmail, and optionally auto-replies.
 *
 * Everything is controlled from the "Settings" tab. No code edits needed.
 */

const INBOX_TAB = 'Inbox';
const SETTINGS_TAB = 'Settings';
const LABEL_ROOT = 'Brand Deals';
const HEADERS = ['Date', 'From', 'Email', 'Subject', '$ Amount', 'Category', 'Reply', 'Open', 'Thread ID'];

const DEFAULT_SETTINGS = [
  ['Setting', 'Value', 'Notes'],
  ['Your name', 'Elena', 'Used in reply templates as {me}'],
  ['Gmail search', 'in:inbox newer_than:30d -from:me -category:promotions -category:social -category:updates -category:forums', 'Which emails to check on each refresh (Gmail search syntax). Remove "-category:promotions" if brand pitches land in your Promotions tab'],
  ['Skip newsletters', 'YES', 'YES = ignore mass emails (anything with an unsubscribe link / mailing-list headers). Real brand pitches are written to you directly'],
  ['Paid keywords', 'budget, rate, rates, compensation, compensate, paid, fee, payment, flat fee, usage rights, deliverables', 'Comma separated'],
  ['Gifting keywords', 'gifted, gifting, gift, free product, pr package, pr box, in exchange for, send you some, seeding', ''],
  ['Affiliate keywords', 'affiliate, commission, per sale, % of sales, discount code, ambassador program', ''],
  ['Brand keywords', 'collab, collaboration, partnership, ugc, brand deal, sponsored post, paid partnership, content creator, creator partnership, influencer', 'An email must contain one of these to be logged at all'],
  ['Spam keywords', 'grow your followers, buy followers, promote your account, crypto, bitcoin, verify your account, blue check, giveaway winner', ''],
  ['Spam senders', '', 'Comma separated addresses or domains, e.g. spammy.biz'],
  ['Ignore $ near words', 'value, worth, retail, msrp, off, discount, valued', 'Product value ≠ pay'],
  ['Auto-reply Paid', 'DRAFT', 'YES = send, DRAFT = save to Gmail Drafts, NO = nothing'],
  ['Auto-reply Gifting', 'DRAFT', 'YES / DRAFT / NO'],
  ['Auto-reply Affiliate', 'DRAFT', 'YES / DRAFT / NO'],
  ['Reply Paid', 'Hi {name},\n\nThank you so much for reaching out! I would love to learn more. My rate card is below:\n\n• 1 UGC video: $___\n• 3 UGC videos: $___\n• Usage rights (paid ads, 30 days): +$___\n\nLet me know the deliverables and timeline you have in mind!\n\n{me}', '{name} = sender first name, {me} = your name'],
  ['Reply Gifting', 'Hi {name},\n\nThank you so much for thinking of me! At the moment I only take on paid partnerships. My UGC rates start at $___ per video. I would love to work together if that fits your budget!\n\n{me}', ''],
  ['Reply Affiliate', 'Hi {name},\n\nThanks for reaching out! I currently partner on a paid basis (affiliate can be added on top). My UGC rates start at $___ per video. Happy to chat if that works for you!\n\n{me}', ''],
];

/* ---------------- Menu ---------------- */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📬 Inbox')
    .addItem('Refresh now', 'refresh')
    .addItem('Scan older emails (last 12 months)', 'scanHistory')
    .addSeparator()
    .addItem('Turn ON auto-refresh (hourly)', 'turnOnAuto')
    .addItem('Turn OFF auto-refresh', 'turnOffAuto')
    .addSeparator()
    .addItem('Set up tabs', 'setup')
    .addItem('Clean up (delete script drafts, labels, rows)', 'cleanUp')
    .addToUi();
}

function setup() {
  const ss = SpreadsheetApp.getActive();
  let settings = ss.getSheetByName(SETTINGS_TAB);
  if (!settings) {
    settings = ss.insertSheet(SETTINGS_TAB);
    settings.getRange(1, 1, DEFAULT_SETTINGS.length, 3).setValues(DEFAULT_SETTINGS);
    settings.getRange('A1:C1').setFontWeight('bold').setBackground('#E4EBDD');
    settings.setColumnWidth(1, 170).setColumnWidth(2, 520).setColumnWidth(3, 320);
    settings.getRange('B:B').setWrap(true).setVerticalAlignment('top');
    settings.setFrozenRows(1);
  }
  let inbox = ss.getSheetByName(INBOX_TAB);
  if (!inbox) {
    inbox = ss.insertSheet(INBOX_TAB, 0);
    inbox.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      .setFontWeight('bold').setBackground('#5F6B3A').setFontColor('#FFFFFF');
    inbox.setFrozenRows(1);
    inbox.getRange('E:E').setNumberFormat('$#,##0');
    inbox.getRange('A:A').setNumberFormat('mmm d, yyyy');
    inbox.hideColumns(HEADERS.length); // Thread ID is for bookkeeping only
    inbox.getRange(1, 1, 1, HEADERS.length).createFilter();
  }
  const sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && sheet1.getLastRow() === 0 && ss.getSheets().length > 2) ss.deleteSheet(sheet1);
}

function turnOnAuto() {
  turnOffAuto();
  ScriptApp.newTrigger('refresh').timeBased().everyHours(1).create();
  SpreadsheetApp.getActive().toast('Auto-refresh is ON (every hour).');
}

function turnOffAuto() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'refresh')
    .forEach(t => ScriptApp.deleteTrigger(t));
}

/* ---------------- Main ---------------- */

function refresh() {
  setup();
  const added = processSearch(readSettings()['gmail search']);
  toast(`Done: ${added} new brand email${added === 1 ? '' : 's'}.`);
}

// Walks back through a year of mail in pages. Apps Script stops at 6 minutes,
// so it saves its place and you can click it again to continue.
function scanHistory() {
  setup();
  const props = PropertiesService.getUserProperties();
  const start = Number(props.getProperty('historyStart') || 0);
  const s = readSettings();
  // Same filters as the regular refresh, just reaching back a year
  const query = String(s['gmail search']).replace(/in:inbox|newer_than:\S+/g, '') + ' newer_than:365d';
  const begun = Date.now();
  let page = start, added = 0, threads;
  do {
    threads = GmailApp.search(query, page, 100);
    added += processThreads(threads, s, false); // no auto-replies to old mail
    page += threads.length;
  } while (threads.length === 100 && Date.now() - begun < 4.5 * 60 * 1000);

  if (threads.length === 100) {
    props.setProperty('historyStart', String(page));
    toast(`Added ${added}. Not finished yet: click "Scan older emails" again to continue.`);
  } else {
    props.deleteProperty('historyStart');
    toast(`History scan finished. Added ${added}.`);
  }
}

function processSearch(query) {
  return processThreads(GmailApp.search(query, 0, 100), readSettings(), true);
}

function processThreads(threads, s, allowReplies) {
  const inbox = SpreadsheetApp.getActive().getSheetByName(INBOX_TAB);
  const seen = new Set(
    inbox.getLastRow() > 1
      ? inbox.getRange(2, HEADERS.length, inbox.getLastRow() - 1, 1).getValues().flat().map(String)
      : []
  );
  const myEmail = Session.getActiveUser().getEmail().toLowerCase();
  const rows = [];

  threads.forEach(thread => {
    const id = thread.getId();
    if (seen.has(id)) return;

    const msg = thread.getMessages()[0];
    const fromRaw = msg.getFrom();
    const email = (fromRaw.match(/<([^>]+)>/) || [, fromRaw])[1].trim().toLowerCase();
    if (email === myEmail) return;

    if (String(s['skip newsletters']).toUpperCase() !== 'NO' && isBulk(msg)) return;

    const name = fromRaw.replace(/<[^>]+>/, '').replace(/"/g, '').trim() || email;
    const text = (msg.getSubject() + '\n' + msg.getPlainBody()).slice(0, 8000);
    const amount = extractAmount(text, s.ignoreNear);
    const category = classify(text.toLowerCase(), email, amount, s);
    if (!category) return; // not a brand email, leave it alone

    thread.addLabel(getLabel(category));

    let reply = '';
    if (allowReplies && category !== 'Spam' && thread.getMessageCount() === 1) {
      const mode = String(s['auto-reply ' + category.toLowerCase()] || 'NO').toUpperCase();
      const body = String(s['reply ' + category.toLowerCase()] || '')
        .replace(/\{name\}/g, name.split(/\s+/)[0])
        .replace(/\{me\}/g, s['your name'] || '');
      if (body && mode === 'YES') { thread.reply(body); reply = '✅ Sent'; }
      else if (body && mode === 'DRAFT') { thread.createDraftReply(body); reply = '📝 Draft'; }
    }

    rows.push([
      msg.getDate(), name, email, msg.getSubject(), amount || '',
      { Paid: '💰 Paid', Gifting: '🎁 Gifting', Affiliate: '🔗 Affiliate', Spam: '🚫 Spam' }[category],
      reply,
      `=HYPERLINK("https://mail.google.com/mail/u/0/#all/${id}","open")`,
      id,
    ]);
    seen.add(id);
  });

  if (rows.length) {
    inbox.getRange(inbox.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);
    inbox.getRange(2, 1, inbox.getLastRow() - 1, HEADERS.length).sort({ column: 1, ascending: false });
  }
  return rows.length;
}

/* ---------------- Clean up ---------------- */

// Deletes only drafts this script wrote (matched by the reply templates' first
// line), removes the Brand Deals labels, and clears the Inbox tab.
function cleanUp() {
  const s = readSettings();
  const openers = ['reply paid', 'reply gifting', 'reply affiliate']
    .map(k => String(s[k] || '').split('\n').slice(1).join(' ').trim().slice(0, 40))
    .filter(Boolean);
  let drafts = 0;
  GmailApp.getDrafts().forEach(d => {
    const body = d.getMessage().getPlainBody().replace(/\s+/g, ' ');
    if (openers.some(o => body.indexOf(o.replace(/\s+/g, ' ')) !== -1)) { d.deleteDraft(); drafts++; }
  });
  ['Paid', 'Gifting', 'Affiliate', 'Spam', ''].forEach(c => {
    const label = GmailApp.getUserLabelByName(c ? `${LABEL_ROOT}/${c}` : LABEL_ROOT);
    if (label) label.deleteLabel();
  });
  const inbox = SpreadsheetApp.getActive().getSheetByName(INBOX_TAB);
  if (inbox && inbox.getLastRow() > 1) inbox.deleteRows(2, inbox.getLastRow() - 1);
  PropertiesService.getUserProperties().deleteProperty('historyStart');
  toast(`Removed ${drafts} drafts, the Brand Deals labels and the Inbox rows.`);
}

/* ---------------- Rules ---------------- */

// Newsletters, promos and receipts are sent by mailing tools that add these
// headers. A brand writing to you personally doesn't.
function isBulk(msg) {
  return Boolean(
    msg.getHeader('List-Unsubscribe') ||
    msg.getHeader('List-Id') ||
    /bulk|list/i.test(msg.getHeader('Precedence') || '')
  );
}

function classify(text, email, amount, s) {
  if (s.spamSenders.some(d => d && email.indexOf(d) !== -1) || hasWord(text, s.spam)) return 'Spam';

  // Must look like a creator pitch (collab, UGC, partnership...). Newsletters,
  // receipts and job alerts that just mention "$" or "payment" are skipped.
  if (!hasWord(text, s.brand)) return null;

  if (amount || hasWord(text, s.paid)) return 'Paid';
  if (hasWord(text, s.affiliate)) return 'Affiliate';
  if (hasWord(text, s.gifting)) return 'Gifting';
  return null;
}

// Whole-word match, so "rate" doesn't hit "separate" and "paid" doesn't hit "prepaid".
function hasWord(text, list) {
  return list.some(k => {
    if (!k) return false;
    const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pre = /^[a-z0-9]/.test(k) ? '(^|[^a-z0-9])' : '';
    const post = /[a-z0-9]$/.test(k) ? '($|[^a-z0-9])' : '';
    return new RegExp(pre + esc + post).test(text);
  });
}

// Finds dollar figures like $500, $1,200, $1.5k, 800 USD. Skips ones sitting
// next to words like "value" or "retail" so product worth isn't read as pay.
function extractAmount(text, ignoreNear) {
  const re = /\$\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d{1,2})?)\s?(k\b)?|(\d{1,3}(?:,\d{3})+|\d+)\s?(usd|dollars)\b/gi;
  let best = 0, m;
  while ((m = re.exec(text))) {
    const around = text.slice(Math.max(0, m.index - 25), m.index + m[0].length + 25).toLowerCase();
    if (ignoreNear.some(w => w && new RegExp('\\b' + w + '\\b').test(around))) continue;
    let n = Number((m[1] || m[3]).replace(/,/g, ''));
    if (!m[2]) n = Math.floor(n);
    if (m[2]) n *= 1000;
    if (n >= 20 && n <= 100000 && n > best) best = n; // ignore tiny/absurd numbers
  }
  return best;
}

/* ---------------- Helpers ---------------- */

function readSettings() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SETTINGS_TAB);
  const s = {};
  sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues()
    .forEach(([k, v]) => { if (k) s[String(k).trim().toLowerCase()] = v; });
  const list = key => String(s[key] || '').toLowerCase().split(',').map(x => x.trim()).filter(Boolean);
  s.paid = list('paid keywords');
  s.gifting = list('gifting keywords');
  s.affiliate = list('affiliate keywords');
  s.brand = list('brand keywords');
  s.spam = list('spam keywords');
  s.spamSenders = list('spam senders');
  s.ignoreNear = list('ignore $ near words');
  return s;
}

function getLabel(category) {
  const name = `${LABEL_ROOT}/${category}`;
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function toast(msg) {
  try { SpreadsheetApp.getActive().toast(msg, '📬 Inbox', 8); } catch (e) { console.log(msg); }
}
