import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { launchBrowser } from 'src/inc/puppeteer.config';

@Injectable()
export class SunatService {
  constructor(private configService: ConfigService) {}

  async ruc(nro_ruc: string) {
    let browser, page;
    try {
      ({ browser, page } = await launchBrowser());
      await page.goto(`${this.configService.get<string>('SUNAT')}`, {
        waitUntil: 'networkidle2',
      });

      await page.evaluate((nro__ruc: string) => {
        const input = document.getElementById('txtRuc') as HTMLInputElement;
        if (input) {
          input.value = nro__ruc;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, nro_ruc);

      await Promise.all([
        page.click('#btnAceptar'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
      ]);

      const result = await page.evaluate(() => {
        const data: any = {};
        // Datos generales
        data.ruc = document
          .querySelector('h4.list-group-item-heading')
          ?.textContent?.split(': ')[1]
          ?.trim();
        data.tipoContribuyente = document
          .querySelectorAll('p.list-group-item-text')[0]
          ?.textContent?.trim();
        data.nombreComercial = document
          .querySelectorAll('p.list-group-item-text')[1]
          ?.textContent?.trim();
        data.fechaInscripcion = document
          .querySelectorAll('p.list-group-item-text')[2]
          ?.textContent?.trim();
        data.fechaInicioActividades = document
          .querySelectorAll('p.list-group-item-text')[3]
          ?.textContent?.trim();
        data.estadoContribuyente = document
          .querySelectorAll('p.list-group-item-text')[4]
          ?.textContent?.trim();
        data.condicionContribuyente = document
          .querySelectorAll('p.list-group-item-text')[5]
          ?.textContent?.trim();
        data.domicilioFiscal = document
          .querySelectorAll('p.list-group-item-text')[6]
          ?.textContent?.trim()
          .replace(/\s+/g, ' ');
        data.sistemaEmisionComprobante = document
          .querySelectorAll('p.list-group-item-text')[7]
          ?.textContent?.trim();
        data.actividadComercioExterior = document
          .querySelectorAll('p.list-group-item-text')[8]
          ?.textContent?.trim();
        data.sistemaContabilidad = document
          .querySelectorAll('p.list-group-item-text')[9]
          ?.textContent?.trim();

        // Actividad económica (principal)
        data.actividadEconomica = document
          .querySelector('table.tblResultado tbody tr')
          ?.textContent?.trim();

        // Comprobantes de pago
        const comprobantesPago = Array.from(
          document.querySelectorAll(
            'table.tblResultado:nth-of-type(2) tbody tr',
          ),
        ).map((row) => row.textContent.trim());

        data.comprobantesPago =
          comprobantesPago.length > 0 ? comprobantesPago : 'NINGUNO';

        // Sistema de emisión electrónica
        /*   const sistemaEmisionElectronica = Array.from(
          document.querySelectorAll(
            'table.tblResultado:nth-of-type(3) tbody tr',
          ),
        ).map((row) => row.textContent.trim());

        data.sistemaEmisionElectronica =
          sistemaEmisionElectronica.length > 0
            ? sistemaEmisionElectronica
            : 'NINGUNO'; */

        // Obteniendo datos específicos
        const h4Elements = Array.from(
          document.querySelectorAll('h4.list-group-item-heading'),
        );

        data.emisorElectronicoDesde = h4Elements
          .find((el) => el.textContent.includes('Emisor electrónico desde:'))
          ?.nextElementSibling?.textContent?.trim();
        data.comprobantesElectronicos = h4Elements
          .find((el) => el.textContent.includes('Comprobantes Electrónicos:'))
          ?.nextElementSibling?.textContent?.trim();
        data.afiliadoPLEDesde = h4Elements
          .find((el) => el.textContent.includes('Afiliado al PLE desde:'))
          ?.nextElementSibling?.textContent?.trim();

        /*data.padrones =
          document
            .querySelector(
              'h4.list-group-item-heading:contains("Padrones:") + table tbody tr',
            )
            ?.textContent?.trim() || 'NINGUNO';*/

        // Datos adicionales
        /* data.emisorElectronicoDesde = document
          .querySelector(
            'h4.list-group-item-heading:contains("Emisor electrónico desde:") + p',
          )
          ?.textContent?.trim();
        data.comprobantesElectronicos = document
          .querySelector(
            'h4.list-group-item-heading:contains("Comprobantes Electrónicos:") + p',
          )
          ?.textContent?.trim();
        data.afiliadoPLEDesde = document
          .querySelector(
            'h4.list-group-item-heading:contains("Afiliado al PLE desde:") + p',
          )
          ?.textContent?.trim();

        // Padrones
        const padrones = Array.from(
          document.querySelectorAll(
            'table.tblResultado:nth-of-type(4) tbody tr',
          ),
        ).map((row) => row.textContent.trim());
        data.padrones = padrones.length > 0 ? padrones : ['NINGUNO'];*/

        return data;
      });

      /*       console.log(result); */
      return result;
    } catch (error) {
      console.error('Error al procesar el RUC:', error);
      return { error: 'Error al procesar el RUC.' };
    } finally {
      if (browser) {
        await browser.close(); // Asegúrate de cerrar el navegador
      }
    }
  }

  async ByDocument(type_document: string, nro_document: string) {
    console.log({ type_document, nro_document });
    /*
  btnPorDocumento

  <select name="tipdoc" id="cmbTipoDoc" class="form-control cmbTipo">				
										 <option value="1" selected="">Documento Nacional de Identidad</option>
										 <option value="4">Carnet de Extranjeria</option>					
										 <option value="7">Pasaporte</option>
										 <option value="A">Ced. Diplomática de Identidad</option>
									</select>

                                    txtNumeroDocumento
                                    btnAceptar
  */
  }

  async ByCompany(company: string) {
    console.log({ company });
    /*
                                    
                                    btnPorRazonSocial
                                    txtNombreRazonSocial
                                    btnAceptar
                                    */
  }
}
