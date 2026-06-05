import db from '../db.js'

// Obtener todos
export const getTipoHabitaciones = (req, res) => {
  db.query("SELECT * FROM tipo_habitacion", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener por ID
export const getTipoHabitacionById = (req, res) => {
  const { id } = req.params

  db.query(
    "SELECT * FROM tipo_habitacion WHERE id_tipo_habitacion = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      if (rows.length === 0) return res.status(404).json({ message: "Tipo de habitación no encontrado" })

      res.json(rows[0])
    }
  )
}

// Crear nuevo
export const createTipoHabitacion = (req, res) => {
  const { nombre_tipo, descripcion, capacidad, precio_base } = req.body

  // Validación básica
  if (!nombre_tipo || capacidad === undefined || precio_base === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios: nombre_tipo, capacidad, precio_base" })
  }

  if (typeof capacidad !== 'number' || typeof precio_base !== 'number') {
    return res.status(400).json({ error: "Capacidad y precio_base deben ser números" })
  }

  const nuevo = { nombre_tipo, descripcion, capacidad, precio_base }

  db.query("INSERT INTO tipo_habitacion SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })

    res.status(201).json({
      message: "Tipo de habitación creado",
      id_insertado: result.insertId
    })
  })
}

// Actualizar (parcial soportado)
export const updateTipoHabitacion = (req, res) => {
  const { id } = req.params
  const { nombre_tipo, descripcion, capacidad, precio_base } = req.body

  const fields = []
  const values = []

  if (nombre_tipo !== undefined) fields.push("nombre_tipo = ?"), values.push(nombre_tipo)
  if (descripcion !== undefined) fields.push("descripcion = ?"), values.push(descripcion)
  if (capacidad !== undefined) {
    if (typeof capacidad !== 'number') return res.status(400).json({ error: "capacidad debe ser un número" })
    fields.push("capacidad = ?"), values.push(capacidad)
  }
  if (precio_base !== undefined) {
    if (typeof precio_base !== 'number') return res.status(400).json({ error: "precio_base debe ser un número" })
    fields.push("precio_base = ?"), values.push(precio_base)
  }

  if (fields.length === 0) return res.status(400).json({ error: "No se proporcionaron campos para actualizar" })

  values.push(id) // id para el WHERE
  const sql = `UPDATE tipo_habitacion SET ${fields.join(", ")} WHERE id_tipo_habitacion = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tipo de habitación no encontrado" })

    res.json({ message: "Tipo de habitación actualizado" })
  })
}

// Eliminar
export const deleteTipoHabitacion = (req, res) => {
  const { id } = req.params

  db.query(
    "DELETE FROM tipo_habitacion WHERE id_tipo_habitacion = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      if (result.affectedRows === 0) return res.status(404).json({ message: "Tipo de habitación no encontrado" })

      res.json({ message: "Tipo de habitación eliminado" })
    }
  )
}
