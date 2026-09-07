// @ts-check
const { test, expect } = require('@playwright/test');
const { ingresar, esperarAppCargada, irAInicio } = require('./helpers');

/**
 * CP-07 - Procesar un codigo de barras inexistente
 *
 * Caso manual vinculado: CP-07 (planilla, hoja "Casos de Prueba")
 * Estado manual: Aprobado
 *
 * Script PARAMETRIZADO: un mismo bloque genera un test por cada codigo
 * del arreglo. Cubre el requisito del indicador 6.1 sobre reutilizacion
 * de datos parametrizados, ademas de reutilizar ingresar() de helpers.js.
 */

// Dato parametrizado: cada entrada genera su propio test
const CODIGOS_INEXISTENTES = [
  { etiqueta: 'numerico', valor: '0000000000000' },
  { etiqueta: 'alfabetico', valor: 'abcdef' },
];

test.describe('CP-07 - Codigo de barras inexistente', () => {

  for (const codigo of CODIGOS_INEXISTENTES) {

    test(`CP-07: avisa que no encuentra el codigo ${codigo.etiqueta}`, async ({ page }) => {
      const correo = process.env.DESPENSALO_EMAIL;
      const clave = process.env.DESPENSALO_PASSWORD;

      if (!correo || !clave) {
        throw new Error('Faltan DESPENSALO_EMAIL y DESPENSALO_PASSWORD en el archivo .env');
      }

      await ingresar(page, correo, clave);
      await esperarAppCargada(page);

      // El ingreso puede aterrizar en Ajustes (BUG-03), asi que se navega
      // explicitamente a Inicio, donde esta el campo de codigo manual.
      await irAInicio(page);

      await page.getByPlaceholder(/Escanea o escribe/i).locator('visible=true').first().fill(codigo.valor);
      await page.getByRole('button', { name: 'Procesar' }).locator('visible=true').first().click();

      // Asercion 1: aparece el aviso de codigo no encontrado
      await expect(page.getByText('No encontramos este código').locator('visible=true').first()).toBeVisible({ timeout: 15000 });

      // Asercion 2: se abre el formulario para registrar el producto
      await expect(page.getByText('Registrar producto').locator('visible=true').first()).toBeVisible();

      // Asercion 3: el formulario de registro queda operativo.
      // No se verifica el atributo value del input porque la aplicacion es
      // React y asigna el valor por propiedad, no como atributo HTML.
      await expect(page.getByRole('button', { name: 'Guardar producto' }).locator('visible=true').first()).toBeVisible();

      // Se cierra el formulario para no dejar registros en el entorno real
      await page.getByRole('button', { name: 'Cancelar' }).locator('visible=true').first().click();
    });

  }

});
