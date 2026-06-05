import db from '../db.js'

// Obtener todos los mantenimientos
export const getMantenimientos = (req, res) => {
  db.query("SELECT * FROM mantenimiento", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener mantenimiento por ID
export const getMantenimientoById = (req, res) => {
  const { id } = req.params
  db.query("SELECT * FROM mantenimiento WHERE id_mantenimiento = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Mantenimiento no encontrado" })
    res.json(rows[0])
  })
}

// Crear nuevo mantenimiento
export const createMantenimiento = (req, res) => {
  const { fecha_inicio, fecha_fin, descripcion, estado, id_habitacion, id_tipo_mantenimiento, id_personal } = req.body

  if (!fecha_inicio || !fecha_fin || estado === undefined || !id_habitacion || !id_tipo_mantenimiento || !id_personal) {
    return res.status(400).json({ error: "Faltan datos obligatorios" })
  }

  const nuevo = { fecha_inicio, fecha_fin, descripcion, estado, id_habitacion, id_tipo_mantenimiento, id_personal }

  db.query("INSERT INTO mantenimiento SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: "Mantenimiento creado", id_insertado: result.insertId })
  })
}

// Actualizar mantenimiento
export const updateMantenimiento = (req, res) => {
  const { id } = req.params
  const { fecha_inicio, fecha_fin, descripcion, estado, id_habitacion, id_tipo_mantenimiento, id_personal } = req.body

  const fields = []
  const values = []

  if (fecha_inicio !== undefined) { fields.push("fecha_inicio = ?"); values.push(fecha_inicio) }
  if (fecha_fin !== undefined) { fields.push("fecha_fin = ?"); values.push(fecha_fin) }
  if (descripcion !== undefined) { fields.push("descripcion = ?"); values.push(descripcion) }
  if (estado !== undefined) { fields.push("estado = ?"); values.push(estado) }
  if (id_habitacion !== undefined) { fields.push("id_habitacion = ?"); values.push(id_habitacion) }
  if (id_tipo_mantenimiento !== undefined) { fields.push("id_tipo_mantenimiento = ?"); values.push(id_tipo_mantenimiento) }
  if (id_personal !== undefined) { fields.push("id_personal = ?"); values.push(id_personal) }

  if (fields.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" })

  values.push(id)
  const sql = `UPDATE mantenimiento SET ${fields.join(", ")} WHERE id_mantenimiento = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Mantenimiento no encontrado" })
    res.json({ message: "Mantenimiento actualizado" })
  })
}

// Eliminar mantenimiento
export const deleteMantenimiento = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM mantenimiento WHERE id_mantenimiento = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Mantenimiento no encontrado" })
    res.json({ message: "Mantenimiento eliminado" })
  })
}
