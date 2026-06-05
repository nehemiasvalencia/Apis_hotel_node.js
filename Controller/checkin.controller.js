import db from '../db.js'

// Obtener todos los checkins
export const getCheckins = (req, res) => {
  db.query("SELECT * FROM checkin", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener checkin por ID
export const getCheckinById = (req, res) => {
  const { id } = req.params
  db.query("SELECT * FROM checkin WHERE id_checkin = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Checkin no encontrado" })
    res.json(rows[0])
  })
}

// Crear checkin
export const createCheckin = (req, res) => {
  const { fecha_hora, observaciones, id_reserva } = req.body
  if (!fecha_hora || !id_reserva) return res.status(400).json({ error: "Faltan datos obligatorios" })

  const nuevo = { fecha_hora, observaciones, id_reserva }
  db.query("INSERT INTO checkin SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: "Checkin creado", id_insertado: result.insertId })
  })
}

// Actualizar checkin
export const updateCheckin = (req, res) => {
  const { id } = req.params
  const { fecha_hora, observaciones, id_reserva } = req.body

  const fields = []
  const values = []

  if (fecha_hora !== undefined) { fields.push("fecha_hora = ?"); values.push(fecha_hora) }
  if (observaciones !== undefined) { fields.push("observaciones = ?"); values.push(observaciones) }
  if (id_reserva !== undefined) { fields.push("id_reserva = ?"); values.push(id_reserva) }

  if (fields.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" })

  values.push(id)
  const sql = `UPDATE checkin SET ${fields.join(", ")} WHERE id_checkin = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Checkin no encontrado" })
    res.json({ message: "Checkin actualizado" })
  })
}

// Eliminar checkin
export const deleteCheckin = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM checkin WHERE id_checkin = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Checkin no encontrado" })
    res.json({ message: "Checkin eliminado" })
  })
}
