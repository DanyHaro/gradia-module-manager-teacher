// tests/unit/middlewares/authorize.test.js
// Pruebas unitarias para el middleware de autorización

const authorize = require('../../../src/middlewares/authorize');

// Mock de sequelize
jest.mock('../../../src/config/database', () => ({
  query: jest.fn(),
  QueryTypes: { SELECT: 'SELECT' }
}));

const sequelize = require('../../../src/config/database');

// Mock de request, response y next
const mockRequest = (user) => ({
  user
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Middleware de Autorización', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Debería rechazar si no hay usuario autenticado', async () => {
    const middleware = authorize(['DOCENTE']);
    const req = mockRequest(null);
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Usuario no autenticado.'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('Debería rechazar si el usuario no tiene ningún rol', async () => {
    sequelize.query.mockResolvedValue([]);

    const middleware = authorize(['DOCENTE']);
    const req = mockRequest({ id: 1, email: 'test@test.com' });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Acceso denegado. No tienes los permisos necesarios.'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('Debería permitir acceso si el usuario tiene el rol requerido', async () => {
    sequelize.query.mockResolvedValue([{ nombre_rol: 'DOCENTE' }]);

    const middleware = authorize(['DOCENTE']);
    const req = mockRequest({ id: 1, email: 'docente@test.com' });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(req.user.roles).toEqual(['DOCENTE']);
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Debería permitir acceso con múltiples roles permitidos', async () => {
    sequelize.query.mockResolvedValue([{ nombre_rol: 'ADMIN' }]);

    const middleware = authorize(['DOCENTE', 'ADMIN']);
    const req = mockRequest({ id: 1, email: 'admin@test.com' });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(req.user.roles).toEqual(['ADMIN']);
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Debería rechazar si el usuario tiene un rol diferente', async () => {
    sequelize.query.mockResolvedValue([{ nombre_rol: 'ESTUDIANTE' }]);

    const middleware = authorize(['DOCENTE']);
    const req = mockRequest({ id: 1, email: 'estudiante@test.com' });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Acceso denegado. Se requiere uno de los siguientes roles: DOCENTE'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('Debería manejar errores de base de datos', async () => {
    sequelize.query.mockRejectedValue(new Error('Database error'));

    const middleware = authorize(['DOCENTE']);
    const req = mockRequest({ id: 1, email: 'test@test.com' });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error al verificar permisos.'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('Debería convertir string de rol a array', async () => {
    sequelize.query.mockResolvedValue([{ nombre_rol: 'DOCENTE' }]);

    const middleware = authorize('DOCENTE'); // String en vez de array
    const req = mockRequest({ id: 1, email: 'docente@test.com' });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  test('Debería llamar query con el userId correcto', async () => {
    sequelize.query.mockResolvedValue([{ nombre_rol: 'DOCENTE' }]);

    const middleware = authorize(['DOCENTE']);
    const req = mockRequest({ id: 123, email: 'docente@test.com' });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(sequelize.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        replacements: { userId: 123 },
        type: 'SELECT'
      })
    );
  });
});
