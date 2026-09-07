# Evaluación de Calidad — despensalo.cl

Evaluación de calidad realizada sobre [despensalo.cl](https://despensalo.cl), una
aplicación web de inventario del hogar que permite registrar productos de
despensa y medicamentos, controlar existencias y recibir alertas de vencimiento.

El trabajo se realizó desde la perspectiva de un usuario final registrado, sin
acceso al código fuente, en el marco de la asignatura Testing Aplicado al
Desarrollo de Sistemas del Instituto Profesional San Sebastián.

**Camilo Meriño** 

---

## Resultados

| | |
|---|---|
| Casos de prueba ejecutados | 10 (5 aprobados, 5 fallidos) |
| Defectos documentados | 7, cuatro de severidad alta |
| Sesiones exploratorias | 3, con 8 escenarios y 4 hallazgos |
| Ejecuciones automatizadas | 24, todas aprobadas y consistentes |

El hallazgo central: la aplicación valida las entradas después de guardarlas y
no antes, de modo que los valores inválidos se aceptan y luego se descartan o
se corrigen sin avisar al usuario. Cinco de los siete defectos responden a esa
misma causa.

---

## Contenido

| Ruta | Qué hay |
|---|---|
| `docs/` | Informe de evaluación, presentación ejecutiva y planilla de registro |
| `evidencias/` | Capturas de pantalla de cada caso y sesión, nombradas por identificador |
| `tests/` | Scripts de automatización |
| `playwright.config.js` | Configuración de los dos entornos de ejecución |
| `resultados.json` | Resultados de las 24 ejecuciones con sus duraciones |

---

## Automatización

Se automatizaron tres casos manuales previamente ejecutados y validados,
seleccionados por ser estables y no depender de datos variables. Los scripts se
ejecutaron 24 veces en dos resoluciones sin variación entre corridas.

### Cómo ejecutar

```bash
npm install
cp .env.example .env
```

Los scripts usan el Chrome instalado en el equipo (`channel: 'chrome'`), así que
no hace falta descargar navegadores. Completa el `.env` con una cuenta de prueba
de despensalo.cl:

```
DESPENSALO_EMAIL=tu_correo_de_prueba
DESPENSALO_PASSWORD=tu_clave_de_prueba
```

Una pasada de verificación:

```bash
npx playwright test
```

La corrida completa, con las tres repeticiones por entorno:

```bash
npx playwright test --repeat-each=3
npx playwright show-report
```

Los scripts están vinculados a su caso manual por el nombre del archivo y el
título del test. `CP-07` está parametrizado con un arreglo de códigos, de modo
que un mismo bloque genera un test por cada valor; `CP-03` y `CP-07` comparten
la función de ingreso definida en `tests/helpers.js`.

La configuración no usa reintentos automáticos: un reintento que convierte un
fallo en éxito ocultaría precisamente la inconsistencia que se busca medir.

### Nota sobre los localizadores

La aplicación mantiene en el DOM dos menús de navegación, uno lateral para
escritorio y una barra inferior para móvil, ocultando el que no corresponde al
ancho actual. Los localizadores toman el que está efectivamente visible, de modo
que el mismo código funciona en ambas resoluciones sin ramificarse.

---

## Ambiente de ejecución

Google Chrome 152.0.7977.83 sobre Windows 11, en resoluciones 1920x1080 y
390x844. Automatización con Playwright 1.48.

La configuración usa `channel: 'chrome'` para trabajar sobre el Chrome instalado
en el equipo. La grabación de video está desactivada; el trace y las capturas
cubren la evidencia de cada ejecución.

## Alcance y restricciones

La evaluación se limitó a acciones equivalentes a las de un usuario normal sobre
el entorno productivo. No se realizaron pruebas de carga, escaneo de
vulnerabilidades, intentos de acceso no autorizado ni generación masiva de
solicitudes.

Las evidencias no incluyen contraseñas ni datos sensibles. Las credenciales de
prueba se mantienen fuera del repositorio, en un archivo `.env` excluido por
`.gitignore`.

Conviene tener presente que los traces de Playwright registran los valores
escritos en los campos, incluida la contraseña. Para ejecutar estos scripts
conviene usar una cuenta de prueba desechable.
