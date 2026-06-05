import db from '../db.js'

// Obtener todos los detalles de factura
export const getDetallesFactura = (req, res) => {
  db.query("SELECT * FROM detalle_factura", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener detalle por ID
export const getDetalleFacturaById = (req, res) => {
  const { id } = req.params
  db.query("SELECT * FROM detalle_factura WHERE id_detalle = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Detalle no encontrado" })
    res.json(rows[0])
  })
}

// Crear nuevo detalle de factura
export const createDetalleFactura = (req, res) => {
  const { id_factura, id_reserva_servicio, cantidad, precio_unitario } = req.body

  if (!id_factura || !id_reserva_servicio || cantidad === undefined || precio_unitario === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios" })
  }

  const nuevo = { id_factura, id_reserva_servicio, cantidad, precio_unitario }

  db.query("INSERT INTO detalle_factura SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: "Detalle de factura creado", id_insertado: result.insertId })
  })
}

// Actualizar detalle de factura
export const updateDetalleFactura = (req, res) => {
  const { id } = req.params
  const { id_factura, id_reserva_servicio, cantidad, precio_unitario } = req.body

  const fields = []
  const values = []

  if (id_factura !== undefined) { fields.push("id_factura = ?"); values.push(id_factura) }
  if (id_reserva_servicio !== undefined) { fields.push("id_reserva_servicio = ?"); values.push(id_reserva_servicio) }
  if (cantidad !== undefined) { fields.push("cantidad = ?"); values.push(cantidad) }
  if (precio_unitario !== undefined) { fields.push("precio_unitario = ?"); values.push(precio_unitario) }

  if (fields.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" })

  values.push(id)
  const sql = `UPDATE detalle_factura SET ${fields.join(", ")} WHERE id_detalle = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Detalle no encontrado" })
    res.json({ message: "Detalle de factura actualizado" })
  })
}

// Eliminar detalle de factura
export const deleteDetalleFactura = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM detalle_factura WHERE id_detalle = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Detalle no encontrado" })
    res.json({ message: "Detalle de factura eliminado" })
  })
}
