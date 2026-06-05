import db from '../db.js'


// Buscar usuario por correo y contraseña (login)
export const loginUsuario = (req, res) => {
  const { correo, contrasena } = req.body

  // Validar que ambos campos lleguen
  if (!correo || !contrasena) {
    return res.status(400).json({ error: "Se requieren correo y contraseña" })
  }

  // Consulta SQL
  const sql = "SELECT * FROM Usuario WHERE correo = ? AND contrasena = ?"

  db.query(sql, [correo, contrasena], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" })
    }
    res.json({
      message: "Inicio de sesión exitoso",
      usuario: rows[0]
    })
  })
}

// Obtener todos los usuarios
export const getUsuarios = (req, res) => {
  db.query("SELECT * FROM Usuario", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener usuario por ID
export const getUsuarioById = (req, res) => {
  const { id } = req.params

  db.query("SELECT * FROM Usuario WHERE Id_usuario = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" })

    res.json(rows[0])
  })
}

// Crear nuevo usuario
export const createUsuario = (req, res) => {
  const { Nombre, correo, Telefono, Documento, contrasena, Id_tipousuario, Estado } = req.body

  if (!Nombre || !correo || !contrasena || !Id_tipousuario) {
    return res.status(400).json({ error: "Faltan datos obligatorios: Nombre, correo, contrasena, Id_tipousuario" })
  }

  const nuevo = { Nombre, correo, Telefono, Documento, contrasena, Id_tipousuario, Estado }

  db.query("INSERT INTO Usuario SET ?", nuevo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })

    res.status(201).json({
      message: "Usuario creado",
      id_insertado: result.insertId
    })
  })
}

// Actualizar usuario (soporta actualización parcial)
export const updateUsuario = (req, res) => {
  const { id } = req.params
  const { Nombre, correo, Telefono, Documento, contrasena, Id_tipousuario, Estado } = req.body

  const fields = []
  const values = []

  if (Nombre !== undefined) { fields.push("Nombre = ?"); values.push(Nombre) }
  if (correo !== undefined) { fields.push("correo = ?"); values.push(correo) }
  if (Telefono !== undefined) { fields.push("Telefono = ?"); values.push(Telefono) }
  if (Documento !== undefined) { fields.push("Documento = ?"); values.push(Documento) }
  if (contrasena !== undefined) { fields.push("contrasena = ?"); values.push(contrasena) }
  if (Id_tipousuario !== undefined) { fields.push("Id_tipousuario = ?"); values.push(Id_tipousuario) }
  if (Estado !== undefined) { fields.push("Estado = ?"); values.push(Estado) }

  if (fields.length === 0) return res.status(400).json({ error: "No se proporcionaron campos para actualizar" })

  values.push(id)
  const sql = `UPDATE Usuario SET ${fields.join(", ")} WHERE Id_usuario = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" })

    res.json({ message: "Usuario actualizado" })
  })
}

// Eliminar usuario
export const deleteUsuario = (req, res) => {
  const { id } = req.params

  db.query("DELETE FROM Usuario WHERE Id_usuario = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" })

    res.json({ message: "Usuario eliminado" })
  })
}
