import db from '../db.js'

// Obtener todos los tipos de servicio
export const getTipoServicios = (req, res) => {
  db.query("SELECT * FROM tipo_servicio", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener tipo de servicio por ID
export const getTipoServicioById = (req, res) => {
  const { id } = req.params

  db.query("SELECT * FROM tipo_servicio WHERE id_tipo_servicio = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Tipo de servicio no encontrado" })

    res.json(rows[0])
  })
}

// Crear nuevo tipo de servicio
export const createTipoServicio = (req, res) => {
  const { nombre_tipo_servicio, descripcion_tipo, estado } = req.body

  if (!nombre_tipo_servicio || estado === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios: nombre_tipo_servicio, estado" })
  }

  const nuevo = { nombre_tipo_servicio, descripcion_tipo, estado }

  db.query("INSERT INTO tipo_servicio SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })

    res.status(201).json({
      message: "Tipo de servicio creado",
      id_insertado: result.insertId
    })
  })
}

// Actualizar tipo de servicio (soporta actualización parcial)
export const updateTipoServicio = (req, res) => {
  const { id } = req.params
  const { nombre_tipo_servicio, descripcion_tipo, estado } = req.body

  const fields = []
  const values = []

  if (nombre_tipo_servicio !== undefined) { fields.push("nombre_tipo_servicio = ?"); values.push(nombre_tipo_servicio) }
  if (descripcion_tipo !== undefined) { fields.push("descripcion_tipo = ?"); values.push(descripcion_tipo) }
  if (estado !== undefined) { fields.push("estado = ?"); values.push(estado) }

  if (fields.length === 0) return res.status(400).json({ error: "No se proporcionaron campos para actualizar" })

  values.push(id)
  const sql = `UPDATE tipo_servicio SET ${fields.join(", ")} WHERE id_tipo_servicio = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tipo de servicio no encontrado" })

    res.json({ message: "Tipo de servicio actualizado" })
  })
}

// Eliminar tipo de servicio
export const deleteTipoServicio = (req, res) => {
  const { id } = req.params

  db.query("DELETE FROM tipo_servicio WHERE id_tipo_servicio = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tipo de servicio no encontrado" })

    res.json({ message: "Tipo de servicio eliminado" })
  })
}
