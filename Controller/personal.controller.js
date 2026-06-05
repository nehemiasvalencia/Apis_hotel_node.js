import db from '../db.js'

// Obtener todo el personal
export const getPersonal = (req, res) => {
  const sql = `
    SELECT 
      p.id_personal,
      p.nombre AS nombre_personal,
      p.telefono,
      p.carnet,
      r.nombre AS nombre_rol,
      t.tipo_turno,
      t.hora_inicio,
      t.hora_fin,
      p.id_rol,
      t.dia_semanas,
      p.usuario_id,
      u.correo AS correo_usuario,
      p.estado
    FROM personal p
    LEFT JOIN roles_personales r ON p.id_rol = r.id_rol
    LEFT JOIN turno t ON r.id_turno = t.id_turno
    LEFT JOIN Usuario u ON p.usuario_id = u.id_usuario
  `

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}



// Obtener personal por ID
export const getPersonalById = (req, res) => {
  const { id } = req.params
  db.query("SELECT * FROM personal WHERE id_personal = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Personal no encontrado" })
    res.json(rows[0])
  })
}

// Crear nuevo personal
export const createPersonal = (req, res) => {
  const { nombre, telefono, carnet, id_rol, usuario_id, estado } = req.body

  if (!nombre || estado === undefined) return res.status(400).json({ error: "Faltan datos obligatorios: nombre, estado" })

  const nuevo = { nombre, telefono, carnet, id_rol, usuario_id, estado }

  db.query("INSERT INTO personal SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: "Personal creado", id_insertado: result.insertId })
  })
}

// Actualizar personal
export const updatePersonal = (req, res) => {
  const { id } = req.params
  const { nombre, telefono, carnet, id_rol, usuario_id, estado } = req.body

  const fields = []
  const values = []

  if (nombre !== undefined) { fields.push("nombre = ?"); values.push(nombre) }
  if (telefono !== undefined) { fields.push("telefono = ?"); values.push(telefono) }
  if (carnet !== undefined) { fields.push("carnet = ?"); values.push(carnet) }
  if (id_rol !== undefined) { fields.push("id_rol = ?"); values.push(id_rol) }
  if (usuario_id !== undefined) { fields.push("usuario_id = ?"); values.push(usuario_id) }
  if (estado !== undefined) { fields.push("estado = ?"); values.push(estado) }

  if (fields.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" })

  values.push(id)
  const sql = `UPDATE personal SET ${fields.join(", ")} WHERE id_personal = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Personal no encontrado" })
    res.json({ message: "Personal actualizado" })
  })
}

// Eliminar personal
export const deletePersonal = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM personal WHERE id_personal = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Personal no encontrado" })
    res.json({ message: "Personal eliminado" })
  })
}
