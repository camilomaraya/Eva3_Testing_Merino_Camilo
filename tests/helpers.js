// @ts-check
const { expect } = require('@playwright/test');

/**
 * Funcion reutilizable de ingreso.
 *
 * Indicador 6.1, nivel 100%: "al menos 1 de los scripts reutiliza una
 * funcion, comando o dato parametrizado". Esta funcion es usada por
 * CP-03 y por CP-07, evitando repetir el flujo de ingreso.
 *
 * Nota tecnica: las etiquetas visibles ("Correo electronico", "Contrasena")
 * no estan asociadas a sus inputs en el HTML, por lo que getByLabel no las
 * resuelve. Se localizan por tipo de campo, que es estable.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} correo
 * @param {string} clave
 */
async function ingresar(page, correo, clave) {
  await page.goto('/');

  // La pantalla inicial tiene dos pestanas: "Ingresar" y "Crear cuenta".
  // exact: true evita coincidir con el boton "Ingresar a Despensalo".
  const pestanaIngresar = page.getByRole('button', { name: 'Ingresar', exact: true });
  if (await pestanaIngresar.isVisible().catch(() => false)) {
    await pestanaIngresar.click();
  }

  const campoCorreo = page.locator('input[type="email"]').first();
  const campoClave = page.locator('input[type="password"]').first();

  await campoCorreo.waitFor({ state: 'visible', timeout: 15000 });
  await campoCorreo.fill(correo);
  await campoClave.fill(clave);

  await page.getByRole('button', { name: /Ingresar a Desp/i }).click();
}

/**
 * Espera a que la aplicacion haya cargado tras el ingreso.
 *
 * No verifica una pantalla concreta a proposito: BUG-03 documenta que el
 * destino cambia segun donde se cerro la sesion anterior. Lo estable es
 * el menu lateral, presente en todas las pantallas internas.
 *
 * @param {import('@playwright/test').Page} page
 */
async function esperarAppCargada(page) {
  // La aplicacion renderiza DOS menus de navegacion en el DOM: uno lateral
  // para escritorio y una barra inferior para movil, ocultando el que no
  // corresponde al ancho actual. Por eso no sirve .first(): en movil ese
  // primer elemento existe pero esta oculto.
  //
  // Se usa el filtro :visible para tomar el menu efectivamente en pantalla,
  // de modo que el mismo script funcione en los dos entornos del 6.2.
  await expect(page.getByText('Botiquín').locator('visible=true').first())
    .toBeVisible({ timeout: 20000 });
}

/**
 * Navega a la pantalla de Inicio (Resumen) usando el menu lateral.
 * Necesario para CP-07: el ingreso no siempre aterriza en Inicio.
 *
 * @param {import('@playwright/test').Page} page
 */
async function irAInicio(page) {
  // Si ya se esta en el Resumen no hace falta navegar.
  const enResumen = await page.getByText('Modo de escaneo').locator('visible=true').first()
    .isVisible().catch(() => false);

  if (!enResumen) {
    await page.getByText('Inicio').locator('visible=true').first().click();
  }

  await expect(page.getByText('Modo de escaneo').locator('visible=true').first())
    .toBeVisible({ timeout: 15000 });
}

module.exports = { ingresar, esperarAppCargada, irAInicio };
