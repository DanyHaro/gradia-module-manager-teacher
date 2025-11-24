// tests/unit/models/Entrega.model.test.js
// Pruebas unitarias para el modelo Entrega

describe('Modelo Entrega', () => {
  describe('Definición del modelo', () => {
    test('Debería definir todos los campos requeridos', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.id_entrega).toBeDefined();
      expect(Entrega.rawAttributes.fecha_entrega).toBeDefined();
      expect(Entrega.rawAttributes.id_actividad).toBeDefined();
      expect(Entrega.rawAttributes.id_usuario).toBeDefined();
      expect(Entrega.rawAttributes.id_grupo).toBeDefined();
      expect(Entrega.rawAttributes.num_intento).toBeDefined();
      expect(Entrega.rawAttributes.calificacion).toBeDefined();
      expect(Entrega.rawAttributes.retroalimentacion).toBeDefined();
    });

    test('id_entrega debería ser primaryKey y autoIncrement', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.id_entrega.primaryKey).toBe(true);
      expect(Entrega.rawAttributes.id_entrega.autoIncrement).toBe(true);
    });

    test('fecha_entrega no debería permitir valores NULL', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.fecha_entrega.allowNull).toBe(false);
    });

    test('num_intento debería tener valor por defecto 1', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.num_intento.defaultValue).toBe(1);
    });
  });

  describe('Campos opcionales para entregas individuales vs grupales', () => {
    test('id_usuario debería permitir NULL (entregas grupales)', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.id_usuario.allowNull).toBe(true);
    });

    test('id_grupo debería permitir NULL (entregas individuales)', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.id_grupo.allowNull).toBe(true);
    });
  });

  describe('Campos de calificación', () => {
    test('calificacion debería ser DECIMAL y permitir NULL', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.calificacion.allowNull).toBe(true);
      expect(Entrega.rawAttributes.calificacion.type.constructor.name).toBe('DECIMAL');
    });

    test('retroalimentacion debería ser TEXT y permitir NULL', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.retroalimentacion.allowNull).toBe(true);
      expect(Entrega.rawAttributes.retroalimentacion.type.constructor.name).toBe('TEXT');
    });
  });

  describe('Configuración de la tabla', () => {
    test('Debería usar el nombre de tabla correcto', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.tableName).toBe('entrega');
    });

    test('Debería usar el schema correcto', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.options.schema).toBe('actividades');
    });

    test('Debería tener timestamps deshabilitado', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.options.timestamps).toBe(false);
    });
  });

  describe('Campos de auditoría', () => {
    test('Debería tener campo created_at', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.created_at).toBeDefined();
      expect(Entrega.rawAttributes.created_at.allowNull).toBe(false);
    });

    test('Debería tener campo updated_at', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.updated_at).toBeDefined();
      expect(Entrega.rawAttributes.updated_at.allowNull).toBe(false);
    });
  });

  describe('Relaciones', () => {
    test('Debería tener foreign key id_actividad obligatorio', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.id_actividad).toBeDefined();
      expect(Entrega.rawAttributes.id_actividad.allowNull).toBe(false);
    });
  });
});
