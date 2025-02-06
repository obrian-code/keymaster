import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'src/inc/puppeteer.config';

@Injectable()
export class ReniecService {
  constructor(private configService: ConfigService) {}
  //http://localhost:3000/reniec?dni=
  async dni(nro_dni: string): Promise<any> {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(this.configService.get<string>('RENIEC_DNI'), {
      waitUntil: 'networkidle2',
    });

    await page.waitForSelector('#dni4', { timeout: 10000 });

    await page.evaluate((nro__dni: string) => {
      const input = document.getElementById('dni4') as HTMLInputElement;
      if (input) {
        input.value = nro__dni;
        input.dispatchEvent(new Event('input', { bubbles: true })); // Disparar evento de entrada
      }
    }, nro_dni);

    await Promise.all([
      page.click('#buscar-dni-button'),
      page.waitForSelector('#resultado_dni', { timeout: 60000 }),
    ]);

    // Esperar a que aparezca el resultado
    await page.waitForSelector('#resultado_dni', { timeout: 10000 });

    // Obtener el resultado
    const response = await page.$eval(
      '#resultado_dni',
      (el) => el.textContent || '',
    );

    // Definir la expresión regular para extraer los datos
    const regex =
      /Número de DNI:\s*(\d+)\s*Nombres:\s*([^\n]+)\s*Apellido Paterno:\s*([^\n]+)\s*Apellido Materno:\s*([^\n]+)\s*Código de Verificación:\s*(\d+)/;

    const match = regex.exec(response);

    // Verifica si se encontró un match
    if (!match) {
      console.error('No se pudo extraer la información del DNI.');
      await browser.close();
      return null; // Devolver null si no se pudo extraer información
    }

    await browser.close(); // Cerrar el navegador

    // Devolver el resultado en formato objeto
    return {
      dni: match[1],
      nombres: match[2],
      apellidoPaterno: match[3],
      apellidoMaterno: match[4],
      codigoVerificacion: match[5],
    };
  }
}
