// controllers/turnoController.js
const { db } = require('../db.js');

// Obtener todos los turnos
const getTurnos = (req, res) => {
  db.query('SELECT * FROM turno', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener turno por ID
const getTurnoById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM turno WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows[0]);
  });
};

// Crear turno
const createTurno = (req, res) => {
  const { nombre } = req.body;
  db.query('INSERT INTO turno (nombre) VALUES (?)', [nombre], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, nombre });
  });
};

// Actualizar turno
const updateTurno = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  db.query('UPDATE turno SET nombre = ? WHERE id = ?', [nombre, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, nombre });
  });
};

// Eliminar turno
const deleteTurno = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM turno WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Turno eliminado' });
  });
};

module.exports = {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno
};
