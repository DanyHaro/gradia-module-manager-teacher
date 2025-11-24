// tests/unit/authenticate.test.js
// Prueba unitaria para el middleware de autenticación

const jwt = require('jsonwebtoken');
const authenticate = require('../../src/middlewares/authenticate');

// Mock de request, response y next
const mockRequest = (authHeader) => ({
  headers: {
    authorization: authHeader
  }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Middleware de Autenticación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  test('Debería rechazar request sin token', () => {
    const req = mockRequest(undefined);
    const res = mockResponse();
    const next = mockNext;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token de autenticación requerido. Por favor inicia sesión.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debería rechazar token inválido', () => {
    const req = mockRequest('Bearer invalid-token');
    const res = mockResponse();
    const next = mockNext;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token inválido. Acceso denegado.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debería aceptar token válido y llamar next()', () => {
    // Crear un token válido
    const payload = { sub: 123, email: 'docente@test.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    const req = mockRequest(`Bearer ${token}`);
    const res = mockResponse();
    const next = mockNext;

    authenticate(req, res, next);

    expect(req.user).toEqual({
      id: payload.sub,
      email: payload.email
    });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Debería rechazar token expirado', () => {
    // Crear un token expirado
    const payload = { sub: 123, email: 'docente@test.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '0s' });

    // Esperar un poco para asegurar que expire
    const req = mockRequest(`Bearer ${token}`);
    const res = mockResponse();
    const next = mockNext;

    // Pequeño delay para asegurar expiración
    setTimeout(() => {
      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expirado. Por favor inicia sesión nuevamente.'
      });
      expect(next).not.toHaveBeenCalled();
    }, 100);
  });
});
