# Nhà Trên Biển – Staff app (standalone)

This version runs without Claude. It uses two free services:

- **GitHub Pages** hosts the app files (the website staff open and install).
- **Firebase** (by Google) stores the shared data (tables, bookings, history, notices) and handles staff login.

Setup takes about 30–45 minutes the first time. You only do it once.

---

## Part 1: Firebase (the shared database and logins)

1. Go to **console.firebase.google.com** and sign in with a Google account (use one the business owns, not a staff member's personal one).
2. Click **Create a project**. Name it e.g. `nha-tren-bien`. You can turn Google Analytics off.
3. **Add a web app:** on the project overview page click the **</>** (Web) icon. Give it a nickname, e.g. `staff-app`. Don't tick "Firebase Hosting". Click **Register app**.
4. Firebase now shows a block of code with `const firebaseConfig = { apiKey: ..., authDomain: ..., ... }`. Copy those six values into **`firebase-config.js`** in this folder, replacing the placeholder values. Keep the quotes.
5. **Create the database:** left menu → **Build → Firestore Database → Create database**.
   - Location: choose **asia-southeast1 (Singapore)**, the closest to Vietnam. This can't be changed later.
   - Start in **production mode**.
6. **Set the security rules:** in Firestore, open the **Rules** tab, delete what's there, paste the contents of **`firestore.rules`** from this folder, and click **Publish**. This makes sure only logged-in staff can see or change anything.
7. **Turn on login:** left menu → **Build → Authentication → Get started → Email/Password → Enable → Save**.
8. **Create staff logins:** Authentication → **Users → Add user**. Enter an email and password.
   - Simplest: one shared login for the restaurant, e.g. `staff@nhatrenbien.vn`, used on the host-stand device and staff phones.
   - Better: one login per staff member, so you can remove someone who leaves (delete their user here).
   - The email doesn't need to be a real inbox; it's just a username.

## Part 2: GitHub Pages (the app itself)

1. Create a free account at **github.com** if you don't have one.
2. Click **+ → New repository**. Name it e.g. `staff`. Choose **Public** (required for free Pages; your data is not in the repository, it's in Firebase behind the login). Click **Create repository**.
3. Click **uploading an existing file**, drag in **everything in this folder** (including the `icons` folder), and click **Commit changes**.
4. Go to the repository's **Settings → Pages**. Under "Build and deployment", Source: **Deploy from a branch**, Branch: **main**, folder **/ (root)** → **Save**.
5. After a minute or two the page shows your address, e.g. `https://yourname.github.io/staff/`.

## Part 3: Connect the two

1. Back in Firebase: **Authentication → Settings → Authorized domains → Add domain** → add `yourname.github.io` (your GitHub address without `https://` and without `/staff/`).
2. Open your app address in a browser. You should see the login screen. Log in with a user from Part 1, step 8.
3. Go to **Settings (Cài đặt)** in the app and create your table layout.

## Part 4: Install on each phone

- **iPhone:** open the address in **Safari** → Share button → **Add to Home Screen**.
- **Android:** open the address in **Chrome** → ⋮ menu → **Install app** (or **Add to Home screen**).

The app then opens from its own icon, full screen, like a normal app. Each phone logs in once and stays logged in.

---

## Day-to-day notes

- **Weak signal:** the app keeps working when the connection drops. Changes are stored on the phone and sent automatically when the signal is back. The yellow banner at the top shows when a phone is offline. Other phones only see those changes once they're sent.
- **Updating the app later:** upload the new `index.html` to GitHub (same way, it replaces the old one), and change `ntb-v1` to `ntb-v2` at the top of `sw.js` and upload that too. Phones pick up the new version the next time they open the app (sometimes it takes two opens).
- **Removing a staff member's access:** Firebase → Authentication → Users → delete their user.
- **Cost:** Firebase's free plan includes 50,000 database reads and 20,000 writes per day, which should be plenty for one restaurant. You can check usage under Firestore → Usage. Avoid leaving the History tab on "Tất cả / All" open on many phones, as that reads the most data.
- **Backups:** download the CSV from the History tab now and then.
- **Data from the Claude version** does not move over automatically; this version starts empty.
