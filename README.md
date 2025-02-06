````
# Web Scraping para Consultas de DNI y Vehículos

Este proyecto es una aplicación de web scraping desarrollada con **NestJS**. Su objetivo es obtener información relacionada con el DNI y los vehículos a través de consultas en línea.

## Funcionalidades

1. **Consulta de DNI**:
   - Permite ingresar un número de DNI y obtener los datos asociados, como nombres y apellidos.

2. **Consulta de SUNARP**:
   - Permite ingresar el número de placa de un vehículo y obtener información relevante sobre el mismo.

## Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones del lado del servidor.
- **Puppeteer**: Biblioteca para el control de navegadores web mediante JavaScript.
- **Axios**: Cliente HTTP para realizar solicitudes.
- **Cheerio**: Librería para la manipulación de HTML del lado del servidor.
- **Tesseract.js**: Biblioteca para el reconocimiento óptico de caracteres (OCR).

## Instalación

Para instalar y configurar el proyecto, sigue estos pasos:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/obrian-code/keymaster.git
````

2. Navega a la carpeta del proyecto:

   ```bash
   cd keymaster
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Crea un archivo `.env` en la raíz del proyecto para definir las variables de entorno necesarias.

## Uso

Para realizar una consulta de DNI, utiliza el siguiente endpoint:

```
GET /reniect/dni
```

Con el cuerpo de la solicitud conteniendo el número de DNI.

Para realizar una consulta a SUNARP, utiliza el siguiente endpoint:

```
GET /sunarp
```

Con el cuerpo de la solicitud conteniendo el número de placa del vehículo.

## Ejemplo de Consultas

### Consulta de DNI

```json
{
  "dni": "50687692"
}
```

### Consulta de Placa de Vehículo

```json
{
  "placa": "A2X163"
}
```
