import db from '../db.js'

// Obtener todos los servicios
export const getServicios = (req, res) => {
  const sql = `
    SELECT 
      s.id_servicio,
      s.nombre,
      s.descripcion,
      s.costo,
      s.estado,
      ts.nombre_tipo_servicio AS tipo_servicio_nombre
    FROM servicio s
    JOIN tipo_servicio ts
      ON s.id_tipo_servicio = ts.id_tipo_servicio
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

// Obtener servicio por ID
export const getServicioById = (req, res) => {
  const { id } = req.params

  db.query("SELECT * FROM servicio WHERE id_servicio = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Servicio no encontrado" })

    res.json(rows[0])
  })
}

// Crear nuevo servicio
export const createServicio = (req, res) => {
  const { nombre, descripcion, costo, id_tipo_servicio, estado } = req.body

  if (!nombre || costo === undefined || estado === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios: nombre, costo, estado" })
  }

  const nuevo = { nombre, descripcion, costo, id_tipo_servicio, estado }

  db.query("INSERT INTO servicio SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })

    res.status(201).json({
      message: "Servicio creado",
      id_insertado: result.insertId
    })
  })
}

// Actualizar servicio (soporta actualización parcial)
export const updateServicio = (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, costo, id_tipo_servicio, estado } = req.body

  const fields = []
  const values = []

  if (nombre !== undefined) { fields.push("nombre = ?"); values.push(nombre) }
  if (descripcion !== undefined) { fields.push("descripcion = ?"); values.push(descripcion) }
  if (costo !== undefined) { fields.push("costo = ?"); values.push(costo) }
  if (id_tipo_servicio !== undefined) { fields.push("id_tipo_servicio = ?"); values.push(id_tipo_servicio) }
  if (estado !== undefined) { fields.push("estado = ?"); values.push(estado) }

  if (fields.length === 0) return res.status(400).json({ error: "No se proporcionaron campos para actualizar" })

  values.push(id)
  const sql = `UPDATE servicio SET ${fields.join(", ")} WHERE id_servicio = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Servicio no encontrado" })

    res.json({ message: "Servicio actualizado" })
  })
}

// Eliminar servicio
export const deleteServicio = (req, res) => {
  const { id } = req.params

  db.query("DELETE FROM servicio WHERE id_servicio = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Servicio no encontrado" })

    res.json({ message: "Servicio eliminado" })
  })
}
