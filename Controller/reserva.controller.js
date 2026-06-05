import db from '../db.js'

// Obtener todas las reservas
export const getReservas = (req, res) => {
  const query = `
    SELECT 
      r.id_reserva, 
      r.fecha_inicio, 
      r.fecha_fin, 
      r.total, 
      r.fecha_reserva, 
      r.estado,
      r.id_habitacion,
      h.numero_habitacion AS habitacion,
      h.descripcion AS descripcion_habitacion,
      h.telefono,
      h.estado,
      r.id_usuario,
      u.nombre AS usuario,
      h.id_tipo_habitacion,
      t.nombre_tipo AS nombre_tipo,
      t.descripcion AS descripcion_tipo,
      t.capacidad,
      t.precio_base AS precio
    FROM reserva r
    INNER JOIN habitacion h ON r.id_habitacion = h.id_habitacion
    INNER JOIN tipo_habitacion t ON h.id_tipo_habitacion = t.id_tipo_habitacion
    INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};



// Obtener reserva por ID
export const getReservaById = (req, res) => {
  const { id } = req.params

  db.query("SELECT * FROM reserva WHERE id_reserva = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Reserva no encontrada" })

    res.json(rows[0])
  })
}

// Crear nueva reserva
export const createReserva = (req, res) => {
  const { fecha_inicio, fecha_fin, total, fecha_reserva, estado, id_habitacion, id_usuario } = req.body;

  if (!fecha_inicio || !fecha_fin || total === undefined || !fecha_reserva || !estado || !id_habitacion) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const nueva = { fecha_inicio, fecha_fin, total, fecha_reserva, estado, id_habitacion, id_usuario };

  // 1️⃣ Insertar la reserva
  db.query("INSERT INTO reserva SET ?", nueva, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const id_reserva = result.insertId;

    // 2️⃣ Actualizar estado de la habitación a 3
    const sqlUpdateHabitacion = "UPDATE habitacion SET estado = ? WHERE id_habitacion = ?";
    db.query(sqlUpdateHabitacion, [3, id_habitacion], (err2, result2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (result2.affectedRows === 0) return res.status(404).json({ message: "Habitación no encontrada para actualizar estado" });

      // 3️⃣ Respuesta final
      res.status(201).json({
        message: "Reserva creada y estado de habitación actualizado",
        id_insertado: id_reserva
      });
    });
  });
};


// Actualizar reserva (soporta actualización parcial)
export const updateReserva = (req, res) => {
  const { id } = req.params
  const { fecha_inicio, fecha_fin, total, fecha_reserva, estado, id_habitacion, id_usuario } = req.body

  // Paso 1: Obtener la reserva actual
  db.query('SELECT id_habitacion FROM reserva WHERE id_reserva = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.length === 0) return res.status(404).json({ message: 'Reserva no encontrada' })

    const oldHabitacionId = result[0].id_habitacion

    // Paso 2: Si hay cambio de habitación, actualizar estado de la habitación antigua
    if (id_habitacion && id_habitacion !== oldHabitacionId) {
      db.query('UPDATE habitacion SET estado = 1 WHERE id_habitacion = ?', [oldHabitacionId], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message })
        // Paso 3: actualizar la reserva
        performReservaUpdate()
      })
    } else {
      // No cambia la habitación, solo actualizar reserva
      performReservaUpdate()
    }

    function performReservaUpdate() {
      const fields = []
      const values = []

      if (fecha_inicio !== undefined) { fields.push("fecha_inicio = ?"); values.push(fecha_inicio) }
      if (fecha_fin !== undefined) { fields.push("fecha_fin = ?"); values.push(fecha_fin) }
      if (total !== undefined) { fields.push("total = ?"); values.push(total) }
      if (fecha_reserva !== undefined) { fields.push("fecha_reserva = ?"); values.push(fecha_reserva) }
      if (estado !== undefined) { fields.push("estado = ?"); values.push(estado) }
      if (id_habitacion !== undefined) { fields.push("id_habitacion = ?"); values.push(id_habitacion) }
      if (id_usuario !== undefined) { fields.push("id_usuario = ?"); values.push(id_usuario) }

      if (fields.length === 0) return res.status(400).json({ error: "No se proporcionaron campos para actualizar" })

      values.push(id)
      const sql = `UPDATE reserva SET ${fields.join(", ")} WHERE id_reserva = ?`

      db.query(sql, values, (err3, result3) => {
        if (err3) return res.status(500).json({ error: err3.message })
        if (result3.affectedRows === 0) return res.status(404).json({ message: "Reserva no encontrada" })

        // Paso 4: Si cambió la habitación, actualizar estado de la nueva habitación a 3
        if (id_habitacion && id_habitacion !== oldHabitacionId) {
          db.query('UPDATE habitacion SET estado = 3 WHERE id_habitacion = ?', [id_habitacion], (err4) => {
            if (err4) return res.status(500).json({ error: err4.message })
            res.json({ message: "Reserva y estados de habitaciones actualizados" })
          })
        } else {
          res.json({ message: "Reserva actualizada" })
        }
      })
    }
  })
}


// Eliminar reserva
export const deleteReserva = (req, res) => {
  const { id } = req.params

  db.query("DELETE FROM reserva WHERE id_reserva = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Reserva no encontrada" })

    res.json({ message: "Reserva eliminada" })
  })
}
