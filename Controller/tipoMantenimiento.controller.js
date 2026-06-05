import db from '../db.js'

// Obtener todos los tipos de mantenimiento
export const getTipoMantenimientos = (req, res) => {
  db.query("SELECT * FROM tipo_mantenimiento", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener tipo de mantenimiento por ID
export const getTipoMantenimientoById = (req, res) => {
  const { id } = req.params

  db.query("SELECT * FROM tipo_mantenimiento WHERE id_tipo_mantenimiento = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Tipo de mantenimiento no encontrado" })

    res.json(rows[0])
  })
}

// Crear nuevo tipo de mantenimiento
export const createTipoMantenimiento = (req, res) => {
  const { nombre_tipo_mantenimiento, descripcion, tiempo_estimado, estado } = req.body

  if (!nombre_tipo_mantenimiento || estado === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios: nombre_tipo_mantenimiento, estado" })
  }

  const nuevo = { nombre_tipo_mantenimiento, descripcion, tiempo_estimado, estado }

  db.query("INSERT INTO tipo_mantenimiento SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })

    res.status(201).json({
      message: "Tipo de mantenimiento creado",
      id_insertado: result.insertId
    })
  })
}

// Actualizar tipo de mantenimiento (soporta actualización parcial)
export const updateTipoMantenimiento = (req, res) => {
  const { id } = req.params
  const { nombre_tipo_mantenimiento, descripcion, tiempo_estimado, estado } = req.body

  const fields = []
  const values = []

  if (nombre_tipo_mantenimiento !== undefined) { fields.push("nombre_tipo_mantenimiento = ?"); values.push(nombre_tipo_mantenimiento) }
  if (descripcion !== undefined) { fields.push("descripcion = ?"); values.push(descripcion) }
  if (tiempo_estimado !== undefined) { fields.push("tiempo_estimado = ?"); values.push(tiempo_estimado) }
  if (estado !== undefined) { fields.push("estado = ?"); values.push(estado) }

  if (fields.length === 0) return res.status(400).json({ error: "No se proporcionaron campos para actualizar" })

  values.push(id)
  const sql = `UPDATE tipo_mantenimiento SET ${fields.join(", ")} WHERE id_tipo_mantenimiento = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tipo de mantenimiento no encontrado" })

    res.json({ message: "Tipo de mantenimiento actualizado" })
  })
}

// Eliminar tipo de mantenimiento
export const deleteTipoMantenimiento = (req, res) => {
  const { id } = req.params

  db.query("DELETE FROM tipo_mantenimiento WHERE id_tipo_mantenimiento = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tipo de mantenimiento no encontrado" })

    res.json({ message: "Tipo de mantenimiento eliminado" })
  })
}
