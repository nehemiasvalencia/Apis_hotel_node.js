import db from '../db.js'

// Obtener todos
export const getTipoUsuarios = (req, res) => {
  db.query("SELECT * FROM tipo_usuario", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener por ID
export const getTipoUsuarioById = (req, res) => {
  const { id } = req.params

  db.query(
    "SELECT * FROM tipo_usuario WHERE Id_tipo_usuario = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      if (rows.length === 0) return res.status(404).json({ message: "Tipo de usuario no encontrado" })

      res.json(rows[0])
    }
  )
}

// Crear nuevo
export const createTipoUsuario = (req, res) => {
  const { Nombre_rol, Descripcion, estado } = req.body

  // Validación básica
  if (!Nombre_rol || estado === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios: Nombre_rol, estado" })
  }

  const nuevo = { Nombre_rol, Descripcion, estado }

  db.query("INSERT INTO tipo_usuario SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })

    res.status(201).json({
      message: "Tipo de usuario creado",
      id_insertado: result.insertId
    })
  })
}

// Actualizar (parcial soportado)
export const updateTipoUsuario = (req, res) => {
  const { id } = req.params
  const { Nombre_rol, Descripcion, estado } = req.body

  const fields = []
  const values = []

  if (Nombre_rol !== undefined) fields.push("Nombre_rol = ?"), values.push(Nombre_rol)
  if (Descripcion !== undefined) fields.push("Descripcion = ?"), values.push(Descripcion)
  if (estado !== undefined) fields.push("estado = ?"), values.push(estado)

  if (fields.length === 0) return res.status(400).json({ error: "No se proporcionaron campos para actualizar" })

  values.push(id) // id para el WHERE
  const sql = `UPDATE tipo_usuario SET ${fields.join(", ")} WHERE Id_tipo_usuario = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tipo de usuario no encontrado" })

    res.json({ message: "Tipo de usuario actualizado" })
  })
}

// Eliminar
export const deleteTipoUsuario = (req, res) => {
  const { id } = req.params

  db.query(
    "DELETE FROM tipo_usuario WHERE Id_tipo_usuario = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      if (result.affectedRows === 0) return res.status(404).json({ message: "Tipo de usuario no encontrado" })

      res.json({ message: "Tipo de usuario eliminado" })
    }
  )
}
