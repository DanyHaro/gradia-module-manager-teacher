// tests/unit/models/Curso.model.test.js
// Pruebas unitarias para el modelo Curso

describe('Modelo Curso', () => {
  describe('Definición del modelo', () => {
    test('Debería definir todos los campos requeridos', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.rawAttributes.id_curso).toBeDefined();
      expect(Curso.rawAttributes.nombre_curso).toBeDefined();
      expect(Curso.rawAttributes.descripcion).toBeDefined();
      expect(Curso.rawAttributes.estado).toBeDefined();
      expect(Curso.rawAttributes.id_usuario).toBeDefined();
    });

    test('id_curso debería ser primaryKey y autoIncrement', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.rawAttributes.id_curso.primaryKey).toBe(true);
      expect(Curso.rawAttributes.id_curso.autoIncrement).toBe(true);
    });

    test('nombre_curso no debería permitir valores NULL', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.rawAttributes.nombre_curso.allowNull).toBe(false);
    });

    test('estado debería tener valor por defecto "activo"', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.rawAttributes.estado.defaultValue).toBe('activo');
    });

    test('descripcion debería permitir valores NULL', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.rawAttributes.descripcion.allowNull).toBe(true);
    });
  });

  describe('Configuración de la tabla', () => {
    test('Debería usar el nombre de tabla correcto', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.tableName).toBe('curso');
    });

    test('Debería usar el schema correcto', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.options.schema).toBe('cursos');
    });

    test('Debería tener timestamps deshabilitado', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.options.timestamps).toBe(false);
    });
  });

  describe('Validaciones de longitud', () => {
    test('nombre_curso debería tener longitud máxima de 200', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.rawAttributes.nombre_curso.type.options.length).toBe(200);
    });
  });

  describe('Campos de auditoría', () => {
    test('Debería tener campo created_at', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.rawAttributes.created_at).toBeDefined();
      expect(Curso.rawAttributes.created_at.allowNull).toBe(false);
    });

    test('Debería tener campo updated_at', () => {
      const Curso = require('../../../src/models/Curso');

      expect(Curso.rawAttributes.updated_at).toBeDefined();
      expect(Curso.rawAttributes.updated_at.allowNull).toBe(false);
    });
  });
});
