import db from '../db.js'

// Obtener todos los roles
export const getRolesPersonales = (req, res) => {
  const sql = `
    SELECT 
      rp.*,
      t.hora_inicio,
      t.hora_fin,
      t.dia_semanas,
      t.tipo_turno
    FROM roles_personales rp
    JOIN turno t
      ON rp.id_turno = t.id_turno
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}


// Obtener rol por ID
export const getRolPersonalById = (req, res) => {
  const { id } = req.params

  db.query("SELECT * FROM roles_personales WHERE id_rol = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Rol no encontrado" })
    res.json(rows[0])
  })
}

// Crear nuevo rol
export const createRolPersonal = (req, res) => {
  const { nombre, descripcion, id_turno, pago } = req.body

  if (!nombre) return res.status(400).json({ error: "Falta el nombre del rol" })

  const nuevo = { nombre, descripcion, id_turno, pago }

  db.query("INSERT INTO roles_personales SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: "Rol creado", id_insertado: result.insertId })
  })
}

// Actualizar rol
export const updateRolPersonal = (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, id_turno, pago } = req.body

  const fields = []
  const values = []

  if (nombre !== undefined) { fields.push("nombre = ?"); values.push(nombre) }
  if (descripcion !== undefined) { fields.push("descripcion = ?"); values.push(descripcion) }
  if (id_turno !== undefined) { fields.push("id_turno = ?"); values.push(id_turno) }
  if (pago !== undefined) { fields.push("pago = ?"); values.push(pago) }

  if (fields.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" })

  values.push(id)
  const sql = `UPDATE roles_personales SET ${fields.join(", ")} WHERE id_rol = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Rol no encontrado" })
    res.json({ message: "Rol actualizado" })
  })
}

// Eliminar rol
export const deleteRolPersonal = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM roles_personales WHERE id_rol = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Rol no encontrado" })
    res.json({ message: "Rol eliminado" })
  })
}
