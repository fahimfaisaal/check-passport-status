import puppeteer from "puppeteer";
import 'dotenv/config'

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1080,
      height: 720
    }
  });
  const page = await browser.newPage();

  console.log('Going to login page')
  await page.goto('https://www.epassport.gov.bd/authorization/login', { waitUntil: 'networkidle2' })
  console.log('Typing email')
  await page.type('input[type=email]', process.env.EMAIL)
  console.log('Typing password')
  await page.type('input[type=password]', process.env.PASSWORD)

  console.log('Clicking to hCaptcha')
  await page.mouse.click(100, 650)

  console.log('Waiting a bit')
  await page.waitForTimeout(5e3)

  console.log('Submitting all credentials')
  await page.click('button[type=submit]')

  console.log('Waiting for application page')
  await page.waitForNetworkIdle()

  await page.waitForSelector('.registration-status')
  const status = await page.$eval('.registration-status', (element) => element.innerText)

  console.log({ status })

  await browser.close()
}

main()
