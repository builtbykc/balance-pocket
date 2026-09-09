# Balance Pocket

**A private, manual net-worth tracker that keeps your financial picture on your device.**

Balance Pocket is for people who want the clarity of a personal balance sheet without connecting a bank account or handing their financial data to another service. Add the accounts that matter, update balances on your own schedule, and save snapshots to see how your net worth changes over time.

It is a mobile-first Progressive Web App (PWA), designed to feel at home on an iPhone while remaining usable in any modern browser.

## Why Balance Pocket?

Most finance apps begin with account aggregation. Balance Pocket begins with a simpler idea: you can get a useful view of your finances by recording a small set of balances periodically.

- **Private by default** — account names, notes, balances, and history are stored in the browser's IndexedDB database. The app has no server-side financial data store.
- **No bank connection required** — there are no credentials to share, institutions to reconnect, or transactions to categorize.
- **A snapshot, not a chore** — update only the accounts you checked; balances you did not touch retain their previous check date.
- **Built for the long view** — every saved update creates a historical snapshot of assets, debt, and net worth.
- **Available offline** — after the production app shell is cached, the installed app can open without a network connection.
- **Portable data** — download a complete JSON backup for restoration or export history as CSV for spreadsheet analysis.

## What you can track

Accounts are organized into four categories:

| Category | Examples | Effect on net worth |
| --- | --- | --- |
| Liquid assets | Checking, savings, cash | Added as an asset |
| Receivables | Money owed to you | Added as an asset |
| Investments | Brokerage and retirement accounts | Added as an asset |
| Credit cards | Current card balances | Subtracted as debt |

Balance Pocket currently uses USD. Negative balances are supported for cases such as overdrafts and credit-card credits.

## The product experience

1. **Add your accounts.** Give each account a name, category, and optional note. No balance is required up front.
2. **Check your balances.** Enter the current value for some or all accounts and mark the ones you verified.
3. **Save a snapshot.** Balance Pocket records the state of every account at that moment.
4. **Follow your progress.** Review total assets, total debt, net worth, account history, and a trend across recent snapshots.
5. **Keep a copy safe.** Download a restorable JSON backup regularly; use CSV when you want to work with the history in Excel or another spreadsheet.

Accounts you no longer use can be archived. They disappear from current totals while remaining intact in past snapshots, and can be restored later.

## Privacy and data ownership

Balance Pocket does not sync data between devices or browser profiles. Its core ledger lives only in the IndexedDB storage associated with the browser or installed PWA where it was created.

That model has important tradeoffs:

- Clearing site data, uninstalling the PWA, losing the device, or using private browsing can make records unavailable.
- Anyone who can open the app on an unlocked device can view its contents; there is no in-app passcode.
- A downloaded backup lives wherever you save or share it. Choosing iCloud Drive or another cloud folder moves that exported copy outside the app's device-only boundary.
- CSV exports are for analysis only. Use the JSON backup to restore the app.

For those reasons, the product prompts users to create a backup after they begin recording history.

## Install on iPhone

1. Open the deployed app in Safari.
2. Tap **Share**, then **Add to Home Screen**.
3. Open Balance Pocket from the new Home Screen icon while online once, and wait for the app to report that offline setup is ready.

Safari and the installed Home Screen app can have separate storage contexts. If you entered data before installing, download a full backup in Safari and restore it inside the installed app if necessary.

## Run locally

### Requirements

- Node.js 22.13 or newer
- npm

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The service worker is intentionally registered only in production, so local development does not enable offline mode.

### Production build

```bash
npm run build
npx serve out
```

The app is exported as a static site to `out/`. After the Next.js build, `scripts/finish-pwa.mjs` fingerprints the output and generates the production service worker's precache list.

### Quality checks

```bash
npm run lint
node --experimental-strip-types --test tests/ledger.test.ts tests/offline.test.mjs
```

The tests cover money parsing and calculations, immutable snapshots, backup validation, safe CSV output, and offline-shell behavior.

## Product principles

- **Manual is a feature.** The product favors a deliberate financial check-in over continuous surveillance and noisy transaction feeds.
- **Local first.** Core functionality does not depend on an account, backend, or third-party financial integration.
- **Honest about risk.** Device-only storage improves privacy, but makes backups essential; the interface says so directly.
- **Calm and focused.** The experience centers on a few meaningful numbers rather than budgets, ads, scores, or recommendations.
- **History should remain trustworthy.** Editing or archiving a current account does not rewrite previously saved snapshots.

## Technology

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4 and shadcn-based UI components
- IndexedDB for the local ledger
- A custom service worker and web app manifest for PWA installation and offline launch
- Static export for simple hosting

## Current scope

Balance Pocket is intentionally a focused balance-sheet tool. It does not currently provide bank synchronization, transaction tracking, budgeting, multi-currency conversion, shared households, cloud sync, authentication, or investment-performance calculations.

