import db from '../db.js'

// Obtener todas las habitaciones
export const getHabitaciones = (req, res) => {
  const sql = `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.descripcion AS descripcion_habitacion,
      h.telefono,
      h.estado,
      h.id_tipo_habitacion,
      t.nombre_tipo AS nombre_tipo,
      t.descripcion AS descripcion_tipo,
      t.capacidad,
      t.precio_base
    FROM habitacion h
    INNER JOIN tipo_habitacion t
      ON h.id_tipo_habitacion = t.id_tipo_habitacion
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

export const getHabitacionesDisponibles = (req, res) => {
  const sql = `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.descripcion AS descripcion_habitacion,
      h.telefono,
      h.estado,
      h.id_tipo_habitacion,
      t.nombre_tipo AS nombre_tipo,
      t.descripcion AS descripcion_tipo,
      t.capacidad,
      t.precio_base
    FROM habitacion h
    INNER JOIN tipo_habitacion t
      ON h.id_tipo_habitacion = t.id_tipo_habitacion
    WHERE h.estado != 3
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Obtener habitación por ID
export const getHabitacionById = (req, res) => {
  const { id } = req.params

  db.query("SELECT * FROM habitacion WHERE id_habitacion = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Habitación no encontrada" })

    res.json(rows[0])
  })
}

// Crear nueva habitación
export const createHabitacion = (req, res) => {
  const { numero_habitacion, id_tipo_habitacion, descripcion, telefono, estado } = req.body

  if (!numero_habitacion || !id_tipo_habitacion || estado === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios: numero_habitacion, id_tipo_habitacion, estado" })
  }

  const nueva = { numero_habitacion, id_tipo_habitacion, descripcion, telefono, estado }

  db.query("INSERT INTO habitacion SET ?", nueva, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })

    res.status(201).json({
      message: "Habitación creada",
      id_insertado: result.insertId
    })
  })
}

// Actualizar habitación (soporta actualización parcial)
export const updateHabitacion = (req, res) => {
  const { id } = req.params
  const { numero_habitacion, id_tipo_habitacion, descripcion, telefono, estado } = req.body

  const fields = []
  const values = []

  if (numero_habitacion !== undefined) { fields.push("numero_habitacion = ?"); values.push(numero_habitacion) }
  if (id_tipo_habitacion !== undefined) { fields.push("id_tipo_habitacion = ?"); values.push(id_tipo_habitacion) }
  if (descripcion !== undefined) { fields.push("descripcion = ?"); values.push(descripcion) }
  if (telefono !== undefined) { fields.push("telefono = ?"); values.push(telefono) }
  if (estado !== undefined) { fields.push("estado = ?"); values.push(estado) }

  if (fields.length === 0) return res.status(400).json({ error: "No se proporcionaron campos para actualizar" })

  values.push(id)
  const sql = `UPDATE habitacion SET ${fields.join(", ")} WHERE id_habitacion = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Habitación no encontrada" })

    res.json({ message: "Habitación actualizada" })
  })
}

// Eliminar habitación
export const deleteHabitacion = (req, res) => {
  const { id } = req.params

  db.query("DELETE FROM habitacion WHERE id_habitacion = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Habitación no encontrada" })

    res.json({ message: "Habitación eliminada" })
  })
}
