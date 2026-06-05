// turno.test.js
const { db } = require('../db.js');
const {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno
} = require('../controllers/turnoController.js');

jest.mock('../db.js');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Test de Turnos', () => {
  beforeEach(() => {
    db.query.mockClear();
  });

  it('getTurnos devuelve un array', () => {
    const req = {};
    const res = createRes();

    db.query.mockImplementation((sql, callback) => {
      callback(null, [{ id: 1, nombre: 'Turno 1' }]);
    });

    getTurnos(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: 'Turno 1' }]);
  });

  it('getTurnoById devuelve un turno', () => {
    const req = { params: { id: 1 } };
    const res = createRes();

    db.query.mockImplementation((sql, params, callback) => {
      callback(null, [{ id: 1, nombre: 'Turno 1' }]);
    });

    getTurnoById(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'Turno 1' });
  });

});
