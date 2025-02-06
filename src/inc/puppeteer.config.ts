// puppeteer.config.ts
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { ConfigService } from '@nestjs/config';

puppeteer.use(AdblockerPlugin());

export default puppeteer;

const config = new ConfigService();

export const proxy = `http://scraperapi:${config.get<string>('SCRAPERAPI_KEY')}@proxy-server.scraperapi.com:8001?country=PE`;

export const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';

export const launchBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      `--proxy-server=${proxy}`, // Configura el proxy
    ],
  });

  // Cierra todas las pestañas existentes antes de abrir una nueva
  const pages = await browser.pages();
  for (const page of pages) {
    await page.close();
  }

  const page = await browser.newPage();
  await page.setUserAgent(userAgent); // Configura el userAgent

  return { browser, page };
};
