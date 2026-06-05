import db from '../db.js'

// Obtener todas las facturas
export const getFacturas = (req, res) => {
  db.query("SELECT * FROM factura", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener factura por ID
export const getFacturaById = (req, res) => {
  const { id } = req.params
  db.query("SELECT * FROM factura WHERE id_factura = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Factura no encontrada" })
    res.json(rows[0])
  })
}

// Crear nueva factura
export const createFactura = (req, res) => {
  const { id_reserva, numero_factura, fecha_emision, subtotal, impuestos, total, monto_pago, id_metodo_pago, estado_pago } = req.body

  if (!id_reserva || !numero_factura || !fecha_emision || subtotal === undefined || impuestos === undefined || total === undefined || monto_pago === undefined || !id_metodo_pago || !estado_pago) {
    return res.status(400).json({ error: "Faltan datos obligatorios" })
  }

  const nueva = { id_reserva, numero_factura, fecha_emision, subtotal, impuestos, total, monto_pago, id_metodo_pago, estado_pago }

  db.query("INSERT INTO factura SET ?", nueva, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: "Factura creada", id_insertado: result.insertId })
  })
}

// Actualizar factura
export const updateFactura = (req, res) => {
  const { id } = req.params
  const { id_reserva, numero_factura, fecha_emision, subtotal, impuestos, total, monto_pago, id_metodo_pago, estado_pago } = req.body

  const fields = []
  const values = []

  if (id_reserva !== undefined) { fields.push("id_reserva = ?"); values.push(id_reserva) }
  if (numero_factura !== undefined) { fields.push("numero_factura = ?"); values.push(numero_factura) }
  if (fecha_emision !== undefined) { fields.push("fecha_emision = ?"); values.push(fecha_emision) }
  if (subtotal !== undefined) { fields.push("subtotal = ?"); values.push(subtotal) }
  if (impuestos !== undefined) { fields.push("impuestos = ?"); values.push(impuestos) }
  if (total !== undefined) { fields.push("total = ?"); values.push(total) }
  if (monto_pago !== undefined) { fields.push("monto_pago = ?"); values.push(monto_pago) }
  if (id_metodo_pago !== undefined) { fields.push("id_metodo_pago = ?"); values.push(id_metodo_pago) }
  if (estado_pago !== undefined) { fields.push("estado_pago = ?"); values.push(estado_pago) }

  if (fields.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" })

  values.push(id)
  const sql = `UPDATE factura SET ${fields.join(", ")} WHERE id_factura = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Factura no encontrada" })
    res.json({ message: "Factura actualizada" })
  })
}

// Eliminar factura
export const deleteFactura = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM factura WHERE id_factura = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Factura no encontrada" })
    res.json({ message: "Factura eliminada" })
  })
}
