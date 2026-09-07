// @ts-check
const { test, expect } = require('@playwright/test');
const { ingresar } = require('./helpers');

/**
 * CP-04 - Ingreso con contrasena incorrecta
 *
 * Caso manual vinculado: CP-04 (planilla, hoja "Casos de Prueba")
 * Estado manual: Fallido (el mensaje aparece en ingles, ver BUG-01)
 *
 * El script comprueba dos cosas: que el acceso es rechazado (correcto)
 * y que el mensaje mostrado es el texto en ingles del proveedor de
 * autenticacion, que es el defecto documentado en BUG-01. La segunda
 * asercion automatiza la deteccion de ese defecto.
 */
test.describe('CP-04 - Rechazo de credenciales invalidas', () => {

  test('CP-04: no permite el ingreso y muestra el error sin traducir (BUG-01)', async ({ page }) => {
    const correo = process.env.DESPENSALO_EMAIL;

    if (!correo) {
      throw new Error('Falta DESPENSALO_EMAIL en el archivo .env');
    }

    await ingresar(page, correo, 'ClaveIncorrecta_QA_2026');

    // Asercion 1: aparece el mensaje de error del proveedor, en ingles.
    // Documenta BUG-01: los mensajes de autenticacion no estan traducidos.
    await expect(page.getByText('Invalid login credentials')).toBeVisible({ timeout: 15000 });

    // Asercion 2: el formulario sigue en pantalla, no se inicio sesion
    await expect(page.getByRole('button', { name: /Ingresar a Desp/i })).toBeVisible();

    // Asercion 3: el panel de autenticacion sigue en pantalla, la sesion
    // no se inicio. Se verifica la pestana "Crear cuenta", presente solo
    // en ese panel.
    //
    // Nota: no se comprueba la ausencia del contenido interno de la
    // aplicacion. Despensalo opera sobre datos guardados en el dispositivo
    // ("La informacion queda guardada en este dispositivo", seccion Ajustes)
    // y ese contenido permanece renderizado aunque el ingreso sea rechazado.
    await expect(page.getByRole('button', { name: 'Crear cuenta' })).toBeVisible();
  });

});
