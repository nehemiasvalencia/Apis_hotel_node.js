import db from '../db.js'

// Obtener todos los servicios de reservas
export const getReservaServicios = (req, res) => {
  const sql = `
    SELECT 
      rs.*,
      s.nombre AS nombre_servicio
    FROM reserva_servicios rs
    JOIN servicio s
      ON rs.id_servicio = s.id_servicio
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}


// Obtener por ID
export const getReservaServicioById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM reserva_servicios WHERE id_reserva = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: "Reserva servicio no encontrada" });
    res.json(rows); // <- devolver todos los registros
  });
}


// Crear nuevo registro

export const createReservaServicio = (req, res) => {
  const body = req.body;
  const servicios = Array.isArray(body) ? body : (body ? [body] : []);

  const id_reserva = servicios.length ? servicios[0].id_reserva : req.params.id_reserva;

  if (!id_reserva) {
    return res.status(400).json({ error: "Debe enviar el id_reserva" });
  }

  // Paso 1: Obtener total de servicios actuales
  db.query(
    "SELECT SUM(cantidad * precio_unitario) AS total_servicios_actual FROM reserva_servicios WHERE id_reserva = ?",
    [id_reserva],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const total_servicios_actual = rows[0].total_servicios_actual || 0;

      // Paso 2: Eliminar todos los servicios de esa reserva
      db.query(
        "DELETE FROM reserva_servicios WHERE id_reserva = ?",
        [id_reserva],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // Si no envió servicios, solo actualizar el total restando los anteriores
          if (!servicios.length) {
            const sqlUpdate = "UPDATE reserva SET total = total - ? WHERE id_reserva = ?";
            return db.query(sqlUpdate, [total_servicios_actual, id_reserva], (err) => {
              if (err) return res.status(500).json({ error: err.message });
              return res.status(200).json({ message: "Servicios eliminados y total actualizado", total_restado: total_servicios_actual });
            });
          }

          // Paso 3: Insertar los nuevos servicios
          for (const s of servicios) {
            if (!s.id_servicio || s.cantidad === undefined || s.precio_unitario === undefined) {
              return res.status(400).json({ error: "Faltan datos obligatorios en uno o más servicios" });
            }
          }

          const values = servicios.map(s => [
            id_reserva,
            s.id_servicio,
            s.cantidad,
            s.precio_unitario
          ]);

          const sqlInsert = `
            INSERT INTO reserva_servicios (id_reserva, id_servicio, cantidad, precio_unitario)
            VALUES ?
          `;

          db.query(sqlInsert, [values], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Paso 4: Calcular total de los nuevos servicios
            const total_nuevos_servicios = servicios.reduce((acc, s) => acc + s.cantidad * s.precio_unitario, 0);

            // Paso 5: Actualizar total de la reserva
            const sqlUpdate = "UPDATE reserva SET total = total - ? + ? WHERE id_reserva = ?";
            db.query(sqlUpdate, [total_servicios_actual, total_nuevos_servicios, id_reserva], (err) => {
              if (err) return res.status(500).json({ error: err.message });

              res.status(201).json({
                message: "Servicios de reserva actualizados correctamente",
                insertados: result.affectedRows,
                total_nuevos_servicios
              });
            });
          });
        }
      );
    }
  );
};



// Actualizar registro
export const updateReservaServicio = (req, res) => {
  const { id } = req.params
  const { id_reserva, id_servicio, cantidad, precio_unitario } = req.body

  const fields = []
  const values = []

  if (id_reserva !== undefined) { fields.push("id_reserva = ?"); values.push(id_reserva) }
  if (id_servicio !== undefined) { fields.push("id_servicio = ?"); values.push(id_servicio) }
  if (cantidad !== undefined) { fields.push("cantidad = ?"); values.push(cantidad) }
  if (precio_unitario !== undefined) { fields.push("precio_unitario = ?"); values.push(precio_unitario) }

  if (fields.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" })

  values.push(id)
  const sql = `UPDATE reserva_servicios SET ${fields.join(", ")} WHERE id_reserva_servicio = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Reserva servicio no encontrada" })
    res.json({ message: "Reserva servicio actualizado" })
  })
}

// Eliminar registro
export const deleteReservaServicio = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM reserva_servicios WHERE id_reserva_servicio = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Reserva servicio no encontrada" })
    res.json({ message: "Reserva servicio eliminado" })
  })
}
