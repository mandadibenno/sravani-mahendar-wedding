# Sravani & Mahendar — Divine Garden V4

**Updated design, mobile-first and English-only.**

## Run on Windows
1. Extract the ZIP and open the folder containing `package.json`.
2. Run `npm install` and then `npm run dev`.
3. Open the localhost URL shown by Vite, usually `http://localhost:5173`.

If you don't want to install Node.js, double-click `preview.html` in this folder for a **static HTML preview** with music controls.

## What is new in V4
- Lord Ganesha is a dedicated transparent artwork in the page, below navigation. It can no longer be cropped off by a background image.
- New romantic cinematic hero layout, elegant typography, decorative gold lines, soft petals and layered scenery.
- No photo frames on the first page.
- English-only visible interface: no Hindi script in the webpage.
- Refined invitation, couple, ceremony date, venue and family blessings sections.
- Original instrumental music `public/audio/wedding-melody.mp3` included; click the invitation button or floating music toggle to play/pause. Browsers require a tap before playing sound.
- Working map link, calendar file, live countdown and Share Invitation action.

## Couple photos
Place `sravani.jpg` and `mahendar.jpg` in `public/photos/`. These will appear **only** in the couple section. You can change the filenames via `src/wedding.js`.

## Edit wedding details
Edit `src/wedding.js` for names, date, venue and family details. The grandparent name spellings are preserved from the message and should be verified before public distribution.

## Customize music
Replace `public/audio/wedding-melody.mp3` with a file you have rights to use, keeping the same name; or edit the audio path in `src/wedding.js`.

## Note
The wedding ceremony is 25 November 2026 at 11:18 AM India time. The source code includes original assets under `public/images` and `public/audio`.
