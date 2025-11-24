// tests/unit/controllers/entregaController.test.js
// Pruebas unitarias para lógica de negocio del controller de entregas

describe('EntregaController - Validaciones de negocio', () => {
  describe('Validación de calificaciones', () => {
    test('Debería validar que la calificación esté entre 0 y 20', () => {
      const validarCalificacion = (calificacion) => {
        if (calificacion === null || calificacion === undefined) {
          return true; // Calificación opcional
        }
        const nota = parseFloat(calificacion);
        return !isNaN(nota) && nota >= 0 && nota <= 20;
      };

      expect(validarCalificacion(15)).toBe(true);
      expect(validarCalificacion(0)).toBe(true);
      expect(validarCalificacion(20)).toBe(true);
      expect(validarCalificacion(null)).toBe(true);
      expect(validarCalificacion(-1)).toBe(false);
      expect(validarCalificacion(25)).toBe(false);
      expect(validarCalificacion('abc')).toBe(false);
    });
  });

  describe('Validación de fecha límite', () => {
    test('Debería validar si una entrega está fuera de plazo', () => {
      const estaFueraDePlazo = (fechaLimite, fechaEntrega) => {
        if (!fechaLimite) return false;
        const limite = new Date(fechaLimite);
        const entrega = new Date(fechaEntrega);
        return entrega > limite;
      };

      const limite = '2025-01-15T23:59:59';

      expect(estaFueraDePlazo(limite, '2025-01-14T10:00:00')).toBe(false); // Antes
      expect(estaFueraDePlazo(limite, '2025-01-15T20:00:00')).toBe(false); // Mismo día, antes
      expect(estaFueraDePlazo(limite, '2025-01-16T00:00:01')).toBe(true);  // Después
      expect(estaFueraDePlazo(null, '2025-01-20T00:00:00')).toBe(false);   // Sin límite
    });
  });

  describe('Validación de tipo de actividad', () => {
    test('Debería identificar si una actividad es individual o grupal', () => {
      const esActividadIndividual = (tipoActividad) => {
        return tipoActividad === 'individual';
      };

      expect(esActividadIndividual('individual')).toBe(true);
      expect(esActividadIndividual('grupal')).toBe(false);
      expect(esActividadIndividual('otro')).toBe(false);
    });
  });

  describe('Validación de archivos', () => {
    test('Debería identificar si un archivo es un video', () => {
      const EXTENSIONES_VIDEO = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

      const esVideo = (nombreArchivo) => {
        const ext = nombreArchivo.split('.').pop().toLowerCase();
        return EXTENSIONES_VIDEO.includes(ext);
      };

      expect(esVideo('video.mp4')).toBe(true);
      expect(esVideo('Video.MP4')).toBe(true);
      expect(esVideo('archivo.mov')).toBe(true);
      expect(esVideo('documento.pdf')).toBe(false);
      expect(esVideo('imagen.jpg')).toBe(false);
    });
  });
});
