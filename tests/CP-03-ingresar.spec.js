// @ts-check
const { test, expect } = require('@playwright/test');
const { ingresar, esperarAppCargada } = require('./helpers');

/**
 * CP-03 - Ingreso con correo y contrasena correctos
 *
 * Caso manual vinculado: CP-03 (planilla, hoja "Casos de Prueba")
 * Estado manual: Fallido (el ingreso aterriza en Ajustes, ver BUG-03)
 *
 * El script verifica lo que si debe cumplirse siempre: que el ingreso
 * es aceptado y la aplicacion queda disponible. El destino incorrecto
 * esta documentado como defecto aparte, no como fallo del script.
 *
 * Reutiliza la funcion ingresar() de helpers.js (indicador 6.1).
 */
test.describe('CP-03 - Ingreso con credenciales validas', () => {

  test('CP-03: el ingreso es aceptado y la aplicacion queda disponible', async ({ page }) => {
    const correo = process.env.DESPENSALO_EMAIL;
    const clave = process.env.DESPENSALO_PASSWORD;

    if (!correo || !clave) {
      throw new Error('Faltan DESPENSALO_EMAIL y DESPENSALO_PASSWORD en el archivo .env');
    }

    await ingresar(page, correo, clave);

    // Asercion 1: el menu lateral esta visible, la sesion se inicio
    await esperarAppCargada(page);

    // Asercion 2: no se muestra el mensaje de credenciales invalidas
    await expect(page.getByText('Invalid login credentials')).toHaveCount(0);

    // Asercion 3: el formulario de ingreso ya no esta en pantalla
    await expect(page.getByRole('button', { name: /Ingresar a Desp/i })).toHaveCount(0);
  });

});
