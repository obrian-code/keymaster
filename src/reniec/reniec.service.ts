import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { launchBrowser } from 'src/inc/puppeteer.config';

@Injectable()
export class ReniecService {
  constructor(private configService: ConfigService) {}
  //http://localhost:3000/reniec?dni=
  async dni(nro_dni: string): Promise<any> {
    let browser, page;
    try {
      // Usa la función para lanzar el navegador
      ({ browser, page } = await launchBrowser());

      await page.goto(
        `${this.configService.get<string>('RENIEC_DNI')}/buscar-datos-por-dni`,
        {
          waitUntil: 'networkidle2',
        },
      );

      await page.waitForSelector('#dni', { timeout: 10000 });

      await page.evaluate((nro__dni: string) => {
        const input = document.getElementById('dni') as HTMLInputElement;
        if (input) {
          input.value = nro__dni;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, nro_dni);

      await Promise.all([
        page.click('#btn-buscar-datos-por-dni'),
        page.waitForSelector('#nombres', { timeout: 60000 }),
        page.waitForSelector('#apellidop', { timeout: 60000 }),
        page.waitForSelector('#apellidom', { timeout: 60000 }),
      ]);

      // Extraer los datos de los elementos
      const nombres = await page.$eval(
        '#nombres',
        (el) => (el as HTMLInputElement).value.trim() || '',
      );
      const apellidoPaterno = await page.$eval(
        '#apellidop',
        (el) => (el as HTMLInputElement).value.trim() || '',
      );
      const apellidoMaterno = await page.$eval(
        '#apellidom',
        (el) => (el as HTMLInputElement).value.trim() || '',
      );

      if (!nombres || !apellidoPaterno || !apellidoMaterno) {
        console.error('No se pudo extraer la información del DNI.');
        return { error: 'No se pudo extraer la información del DNI.' };
      }

      // Devolver el resultado en formato objeto
      return {
        dni: nro_dni, // Aquí puedes mantener el DNI ingresado
        nombres,
        apellidoPaterno,
        apellidoMaterno,
      };
    } catch (error) {
      console.error('Error al procesar el DNI:', error);
      return { error: 'Error al procesar el DNI.' }; // Manejo de error
    } finally {
      if (browser) {
        await browser.close(); // Asegúrate de cerrar el navegador en el bloque finally
      }
    }
  }

  async dniCheckDigit(nro_dni: string) {
    let browser, page;
    try {
      // Usa la función para lanzar el navegador
      ({ browser, page } = await launchBrowser());

      await page.goto(
        `${this.configService.get<string>('RENIEC_DNI')}/obtener-digito-verificador-del-dni`,
        {
          waitUntil: 'networkidle2',
        },
      );

      await page.waitForSelector('#dniveri', { timeout: 10000 });

      await page.evaluate((nro__dni: string) => {
        const input = document.getElementById('dniveri') as HTMLInputElement;
        if (input) {
          input.value = nro__dni;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, nro_dni);

      await Promise.all([
        page.click('#btn-buscar-por-dniveri'),
        page.waitForSelector('#digito_verificador', { timeout: 60000 }),
      ]);

      // Extraer los datos de los elementos
      const digito_verificador = await page.$eval(
        '#digito_verificador',
        (el) => (el as HTMLInputElement).value.trim() || '',
      );
      console.log({ digito_verificador });
      if (!digito_verificador) {
        console.error('No se pudo extraer la información del DNI.');
        return { error: 'No se pudo extraer la información del DNI.' };
      }

      // Devolver el resultado en formato objeto
      return {
        dni: nro_dni, // Aquí puedes mantener el DNI ingresado
        digito_verificador,
      };
    } catch (error) {
      console.error('Error al procesar el DNI:', error);
      return { error: 'Error al procesar el DNI.' }; // Manejo de error
    } finally {
      if (browser) {
        await browser.close(); // Asegúrate de cerrar el navegador en el bloque finally
      }
    }
  }
}
