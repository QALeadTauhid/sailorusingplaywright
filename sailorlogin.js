const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the login page
    await page.goto('https://www.sailor.clothing/login', { waitUntil: 'load', timeout: 60000 });
    console.log('Page loaded successfully');

    // Wait for email input to be visible (valid credentials)
    await page.waitForSelector('//input[@class="form-control" and @type="email"]', { visible: true, timeout: 60000 });
    await page.fill('//input[@class="form-control" and @type="email"]', 'testac-------@gmail.com');
    await page.fill('//input[@placeholder="Password"]', 'Dkvghjghjgjc');
    await page.click('//button[normalize-space()="Login Now"]');

    // Wait for logout button to appear after login (successful login)
    await page.waitForSelector('//a[normalize-space()="Logout"]', { visible: true, timeout: 60000 });
    console.log('Login successful - Logout button is visible');

    // LOG OUT after successful login
    await page.click('//a[normalize-space()="Logout"]');
    console.log('Logged out successfully');

    // Navigate back to login page after logout
    await page.goto('https://www.sailor.clothing/login', { waitUntil: 'load', timeout: 60000 });
    console.log('Navigated back to login page');

    // Negative Test: Invalid credentials
    await page.fill('//input[@class="form-control" and @type="email"]', 'invalid_email@example.com');
    await page.fill('//input[@placeholder="Password"]', 'invalidpassword');
    await page.click('//button[normalize-space()="Login Now"]');

    // Wait for error message (user not found)
    await page.waitForSelector('//div[contains(text(),"User not found")]', { visible: true, timeout: 60000 });
    console.log('Login failed - Error message displayed');

    // Empty fields test
    await page.fill('//input[@class="form-control" and @type="email"]', '');
    await page.fill('//input[@placeholder="Password"]', '');
    await page.click('//button[normalize-space()="Login Now"]');

    // Wait for unauthorized error message
    await page.waitForSelector('//div[contains(text(),"Unauthorized")]', { visible: true, timeout: 60000 });
    console.log('Login failed - Unauthorized error message displayed');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close the browser after the test
    await browser.close();
  }
})();
