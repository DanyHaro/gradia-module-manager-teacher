# Testing - Backend Teacher

## Estructura de Carpetas

```
tests/
├── unit/              # Pruebas unitarias (funciones aisladas)
│   └── authenticate.test.js
└── integration/       # Pruebas de integración (endpoints completos)
    └── entregas.test.js
```

## Comandos Disponibles

```bash
# Ejecutar TODAS las pruebas (unit + integration)
npm test

# Ejecutar SOLO pruebas unitarias
npm run test:unit

# Ejecutar SOLO pruebas de integración
npm run test:integration

# Ejecutar pruebas en modo watch (se re-ejecutan al guardar cambios)
npm run test:watch

# Ejecutar con reporte de cobertura de código
npm run test:coverage
```

## Tipos de Pruebas

### Pruebas Unitarias (unit/)
- Prueban funciones o módulos de forma aislada
- No requieren base de datos ni servidor corriendo
- Son rápidas y específicas
- Ejemplo: `authenticate.test.js` prueba el middleware de autenticación

### Pruebas de Integración (integration/)
- Prueban endpoints completos de la API
- Requieren conexión a base de datos de test
- Simulan requests HTTP reales
- Ejemplo: `entregas.test.js` prueba endpoints de entregas

## Cómo Escribir Nuevas Pruebas

### Prueba Unitaria
```javascript
// tests/unit/mi-funcion.test.js
const miFuncion = require('../../src/utils/mi-funcion');

describe('Mi Función', () => {
  test('Debería retornar X cuando Y', () => {
    const resultado = miFuncion(input);
    expect(resultado).toBe(expected);
  });
});
```

### Prueba de Integración
```javascript
// tests/integration/mi-endpoint.test.js
const request = require('supertest');
const app = require('../../app');

describe('GET /mi-endpoint', () => {
  test('Debería retornar 200', async () => {
    const response = await request(app)
      .get('/mi-endpoint')
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

## Configuración para Pruebas de Integración

Las pruebas de integración actualmente son **placeholders** (no ejecutan pruebas reales).

Para activarlas completamente:

1. **Modificar app.js** para exportar la app sin iniciar el servidor:
```javascript
// Al final de app.js
module.exports = app;
```

2. **Crear archivo separado para iniciar servidor** (server.js):
```javascript
const app = require('./app');
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

3. **Configurar base de datos de test**:
- Crear `.env.test` con credenciales de BD de test
- Usar `beforeAll()` para poblar datos de prueba
- Usar `afterAll()` para limpiar la BD

4. **Descomentar los tests** en `integration/*.test.js`

## Cobertura de Código

El reporte de cobertura muestra qué % del código está cubierto por tests:

```bash
npm run test:coverage
```

Genera un reporte en `coverage/` mostrando:
- % de líneas ejecutadas
- % de funciones probadas
- % de ramas (if/else) cubiertas

## Buenas Prácticas

[✓] **Nombrar tests descriptivamente**: "Debería rechazar token expirado"
[✓] **Un test por caso**: No mezclar múltiples validaciones en un solo test
[✓] **Usar beforeEach/afterEach**: Para setup y cleanup entre tests
[✓] **Mock de dependencias externas**: No llamar APIs reales o AWS S3 en tests
[✓] **Tests independientes**: Cada test debe poder ejecutarse solo

## Ejemplos de Aserciones

```javascript
expect(resultado).toBe(5);                    // Igualdad exacta
expect(resultado).toEqual({id: 1});           // Igualdad de objetos
expect(resultado).toBeTruthy();               // Verdadero
expect(resultado).toBeNull();                 // Null
expect(array).toContain('elemento');          // Array contiene
expect(funcion).toHaveBeenCalled();          // Función fue llamada (mock)
expect(funcion).toHaveBeenCalledWith(arg);   // Con argumentos específicos
```

## Troubleshooting

**Error: "Cannot find module"**
- Verificar que las rutas en require() sean correctas
- Asegurar que el módulo esté exportado correctamente

**Tests fallan con "Connection refused"**
- Las pruebas de integración requieren BD de test
- Verificar que `.env.test` esté configurado

**Tests pasan localmente pero fallan en CI/CD**
- Verificar que las variables de entorno estén configuradas
- Asegurar que la BD de test esté disponible
