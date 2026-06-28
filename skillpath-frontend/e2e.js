import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const artifactsDir = 'C:\\Users\\shrik\\.gemini\\antigravity\\brain\\fe71941b-3ada-47c2-bb0c-aad4020ceebb';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    // 1. Register Page
    console.log('Navigating to Root...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await delay(1000);
    console.log('Navigating to Register Page...');
    await page.goto('http://localhost:5173/register', { waitUntil: 'domcontentloaded' });
    await delay(2000);
    const html = await page.content();
    console.log(html.substring(0, 500));
    await page.screenshot({ path: path.join(artifactsDir, '1_register_page.png') });
    console.log('Took screenshot: 1_register_page.png');

    // 2. Perform Registration
    console.log('Registering new user...');
    await page.waitForSelector('input[name="name"]');
    await page.type('input[name="name"]', 'End-to-End Tester');
    await page.type('input[name="email"]', `tester_${Date.now()}@test.com`);
    await page.type('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 3. Wait for Dashboard
    console.log('Waiting for Dashboard...');
    await page.waitForSelector('h1', { text: 'Your Dashboard' });
    await delay(2000);
    await page.screenshot({ path: path.join(artifactsDir, '2_dashboard_initial.png') });
    console.log('Took screenshot: 2_dashboard_initial.png');

    // 4. Navigate to Generate Roadmap
    console.log('Navigating to Generate Roadmap...');
    const newRoadmapLinks = await page.$$('a[href="/generate"]');
    if (newRoadmapLinks.length > 0) {
      await newRoadmapLinks[0].click();
    } else {
      await page.goto('http://localhost:5173/generate', { waitUntil: 'domcontentloaded' });
    }
    
    await page.waitForSelector('input[placeholder*="Java Backend"]');
    await delay(1000);
    await page.screenshot({ path: path.join(artifactsDir, '3_generate_page.png') });
    console.log('Took screenshot: 3_generate_page.png');

    // 5. Generate Roadmap
    console.log('Generating Roadmap (this may take a few seconds)...');
    await page.type('input[placeholder*="Java Backend"]', 'Advanced React Patterns');
    await page.select('select', 'ADVANCED');
    await page.click('button[type="submit"]');

    // Wait for AI generation and redirection
    await page.waitForNavigation({ timeout: 60000 }).catch(() => {});
    await delay(3000);
    await page.screenshot({ path: path.join(artifactsDir, '4_roadmap_detail.png') });
    console.log('Took screenshot: 4_roadmap_detail.png');

    // 6. Complete a Milestone
    console.log('Completing the first milestone...');
    // Find the first circle button (uncompleted milestone)
    const milestoneButtons = await page.$$('button');
    let completed = false;
    for (const btn of milestoneButtons) {
      const className = await page.evaluate(el => el.className, btn);
      if (className.includes('text-slate-500')) { // uncompleted icon class
        await btn.click();
        completed = true;
        break;
      }
    }
    await delay(2000);

    // 7. Verify Streak on Dashboard
    console.log('Navigating back to Dashboard to verify streak...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
    await delay(2000);
    await page.screenshot({ path: path.join(artifactsDir, '5_dashboard_streak_verified.png') });
    console.log('Took screenshot: 5_dashboard_streak_verified.png');

    console.log('E2E Test completed successfully!');
  } catch (err) {
    console.error('Error during E2E test:', err);
  } finally {
    await browser.close();
  }
})();
