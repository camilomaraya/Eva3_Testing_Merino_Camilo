// @ts-check
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuracion de la suite QA de despensalo.cl
 * Evaluacion U3 - Testing Aplicado al Desarrollo de Sistemas
 *
 * Indicador 6.2: exige ejecutar en 2 entornos distintos. La rubrica admite
 * dos navegadores o dos resoluciones. Aqui se usan dos resoluciones sobre
 * Chrome instalado en el equipo (channel: 'chrome'), porque la descarga de
 * los navegadores propios de Playwright fallo por restricciones de red.
 *
 * La resolucion movil resulto util ademas para verificar que la aplicacion
 * alterna entre el menu lateral y una barra inferior de navegacion.
 */
module.exports = defineConfig({
  testDir: './tests',

  // Secuencial: el sitio es un entorno productivo real y la evaluacion
  // prohibe generar solicitudes masivas.
  workers: 1,
  fullyParallel: false,

  // Sin reintentos: un reintento que "arregla" un fallo esconde
  // justamente la inconsistencia que mide el indicador 6.2.
  retries: 0,

  timeout: 30000,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'resultados.json' }],
  ],

  use: {
    baseURL: 'https://despensalo.cl',

    // Evidencia de ejecucion (indicadores 6.1 y 6.2).
    // Sin video: requiere ffmpeg, que no pudo descargarse en el equipo de
    // trabajo. Trace y capturas cubren la evidencia exigida.
    trace: 'on',
    screenshot: 'on',

    actionTimeout: 10000,
    navigationTimeout: 20000,
  },

  projects: [
    {
      name: 'chrome-escritorio-1920x1080',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'chrome-movil-390x844',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
