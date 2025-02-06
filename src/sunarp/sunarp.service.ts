import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'src/inc/puppeteer.config';
import Tesseract from 'tesseract.js';

@Injectable()
export class SunarpService {
  constructor(private configService: ConfigService) {}

  async vehiculo_placa(placa: string) {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(this.configService.get<string>('SUNARP_VECHICULO_PLACA'), {
      waitUntil: 'networkidle2',
    });

    await page.waitForSelector('#nroPlaca', { timeout: 10000 });

    // Ingresar el número de placa 'PC3060'
    await page.evaluate((__placa: string) => {
      const input = document.getElementById('nroPlaca') as HTMLInputElement;
      if (input) {
        input.value = __placa;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, placa);

    // Obtener el contenido HTML de la página
    const content = await page.content();
    const $ = cheerio.load(content);

    // Obtener la URL de la imagen en Base64
    const base64Image = $('img#image').attr('src');
    console.log({ base64Image });
    if (!base64Image) {
      console.error('No se encontró la imagen.');
      await browser.close(); // Asegúrate de cerrar el navegador en caso de error
      return null; // Devolver null si no se encontró la imagen
    }

    // Extraer texto del captcha
    const imageResponse = await axios.get(base64Image, {
      responseType: 'arraybuffer',
    });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    const {
      data: { text },
    } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: (m) => console.log(m), // Progreso de la OCR
    });
    console.log({ text });
    console.log('Texto extraído de la imagen:', text.trim());

    // Ingresar el texto del captcha
    await page.type('#codigoCaptcha', text.trim(), { delay: 100 });

    // Hacer clic en el botón de login
    await page.click(
      '.ant-btn.btn-sunarp-green.ant-btn-primary.ant-btn-lg.btn',
    );

    const base64ImageV = await page.$eval(
      '.container-data-vehiculo img',
      (img) => img.src,
    );

    if (!base64Image) {
      console.error('No se encontró la imagen.');
      return;
    }
    await browser.close(); // Cerrar el navegador

    return base64ImageV; // Devolver la imagen en Base64
  }
}
