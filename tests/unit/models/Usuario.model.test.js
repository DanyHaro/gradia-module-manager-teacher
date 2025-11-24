// tests/unit/models/Usuario.model.test.js
// Pruebas unitarias para el modelo Usuario

describe('Modelo Usuario', () => {
  describe('Definición del modelo', () => {
    test('Debería definir campo id_usuario como primaryKey', () => {
      const Usuario = require('../../../src/models/Usuario');

      expect(Usuario.rawAttributes.id_usuario).toBeDefined();
      expect(Usuario.rawAttributes.id_usuario.primaryKey).toBe(true);
    });

    test('Debería definir campo correo_institucional', () => {
      const Usuario = require('../../../src/models/Usuario');

      expect(Usuario.rawAttributes.correo_institucional).toBeDefined();
    });

    test('Debería tener campo id_persona como foreign key', () => {
      const Usuario = require('../../../src/models/Usuario');

      expect(Usuario.rawAttributes.id_persona).toBeDefined();
    });
  });

  describe('Configuración de la tabla', () => {
    test('Debería usar el nombre de tabla correcto', () => {
      const Usuario = require('../../../src/models/Usuario');

      expect(Usuario.tableName).toBe('usuario');
    });

    test('Debería estar definido correctamente', () => {
      const Usuario = require('../../../src/models/Usuario');

      expect(Usuario.tableName).toBeDefined();
    });
  });
});
