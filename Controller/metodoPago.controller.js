import db from '../db.js'

// Obtener todos los métodos de pago
export const getMetodosPago = (req, res) => {
  db.query("SELECT * FROM metodo_pago", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener método de pago por ID
export const getMetodoPagoById = (req, res) => {
  const { id } = req.params
  db.query("SELECT * FROM metodo_pago WHERE id_metodo_pago = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Método de pago no encontrado" })
    res.json(rows[0])
  })
}

// Crear nuevo método de pago
export const createMetodoPago = (req, res) => {
  const { nombre, descripcion, estado } = req.body

  if (!nombre || estado === undefined) return res.status(400).json({ error: "Faltan datos obligatorios: nombre, estado" })

  const nuevo = { nombre, descripcion, estado }

  db.query("INSERT INTO metodo_pago SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: "Método de pago creado", id_insertado: result.insertId })
  })
}

// Actualizar método de pago
export const updateMetodoPago = (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, estado } = req.body

  const fields = []
  const values = []

  if (nombre !== undefined) { fields.push("nombre = ?"); values.push(nombre) }
  if (descripcion !== undefined) { fields.push("descripcion = ?"); values.push(descripcion) }
  if (estado !== undefined) { fields.push("estado = ?"); values.push(estado) }

  if (fields.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" })

  values.push(id)
  const sql = `UPDATE metodo_pago SET ${fields.join(", ")} WHERE id_metodo_pago = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Método de pago no encontrado" })
    res.json({ message: "Método de pago actualizado" })
  })
}

// Eliminar método de pago
export const deleteMetodoPago = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM metodo_pago WHERE id_metodo_pago = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Método de pago no encontrado" })
    res.json({ message: "Método de pago eliminado" })
  })
}
