import db from '../db.js'
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

// Obtener todos los checkouts
export const getCheckouts = (req, res) => {
  db.query("SELECT * FROM checkout_repository", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Obtener checkout por ID
export const getCheckoutById = (req, res) => {
  const { id } = req.params
  db.query("SELECT * FROM checkout_repository WHERE id_checkout = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.status(404).json({ message: "Checkout no encontrado" })
    res.json(rows[0])
  })
}


export const createCheckout = async (req, res) => {
  const { fecha_hora, observaciones, id_reserva } = req.body;
  if (!fecha_hora || !id_reserva)
    return res.status(400).json({ error: "Faltan datos obligatorios" });

  try {
    // 1️⃣ Insertar checkout en la DB
    const nuevo = { fecha_hora, observaciones, id_reserva };
    const result = await new Promise((resolve, reject) => {
      db.query("INSERT INTO checkout_repository SET ?", nuevo, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    const id_checkout = result.insertId;

    // 2️⃣ Obtener datos de reserva, cliente y habitación
    const reservaData = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          r.id_reserva,
          r.fecha_inicio,
          r.fecha_fin,
          r.total,
          u.Nombre AS cliente_nombre,
          u.correo,
          u.Telefono,
          h.numero_habitacion AS habitacion_numero,
          h.descripcion AS habitacion_desc
        FROM reserva r
        JOIN habitacion h ON r.id_habitacion = h.id_habitacion
        JOIN Usuario u ON r.id_usuario = u.id_usuario
        WHERE r.id_reserva = ?
      `;
      db.query(sql, [id_reserva], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });

    if (!reservaData)
      return res.status(404).json({ error: "Reserva no encontrada" });

    const totalReserva = Number(reservaData.total) || 0;

    // 3️⃣ Obtener servicios asociados
    const servicios = await new Promise((resolve, reject) => {
      const sql = `
        SELECT s.nombre AS servicio, rs.cantidad, rs.precio_unitario
        FROM reserva_servicios rs
        JOIN servicio s ON rs.id_servicio = s.id_servicio
        WHERE rs.id_reserva = ?
      `;
      db.query(sql, [id_reserva], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // 4️⃣ Crear PDF limpio
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // Headers para que el navegador lo descargue
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=checkout_${id_checkout}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Fuente básica (Helvetica) que soporta UTF-8
    doc.font("Helvetica-Bold").fontSize(18).text("HOTEL - COMPROBANTE DE CHECKOUT", {
      align: "center",
    });
    doc.moveDown(1);

    doc.font("Helvetica").fontSize(12).text(`Fecha del Checkout: ${fecha_hora}`);
    if (observaciones) doc.text(`Observaciones: ${observaciones}`);
    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(14).text("Información del Cliente");
    doc.font("Helvetica").fontSize(12)
      .text(`Nombre: ${reservaData.cliente_nombre}`)
      .text(`Correo: ${reservaData.correo}`)
      .text(`Teléfono: ${reservaData.Telefono}`);
    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(14).text("Información de la Habitación");
    doc.font("Helvetica").fontSize(12)
      .text(`Número: ${reservaData.habitacion_numero}`)
      .text(`Descripción: ${reservaData.habitacion_desc}`)
      .text(`Fecha de entrada: ${new Date(reservaData.fecha_inicio).toLocaleDateString()}`)
      .text(`Fecha de salida: ${new Date(reservaData.fecha_fin).toLocaleDateString()}`);
    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(14).text("Servicios");
    doc.font("Helvetica").fontSize(12);
    if (servicios.length === 0) {
      doc.text("No se registraron servicios.");
    } else {
      servicios.forEach((s, i) => {
        const cantidad = Number(s.cantidad) || 0;
        const precio = Number(s.precio_unitario) || 0;
        const totalServicio = (cantidad * precio).toFixed(2);
        doc.text(
          `${i + 1}. ${s.servicio} - Cantidad: ${cantidad} - Precio Unitario: $${precio.toFixed(2)} - Total: $${totalServicio}`
        );
      });
    }
    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(14).text(`Total de la Reserva: $${totalReserva.toFixed(2)}`);
    doc.end();
  } catch (error) {
    console.error("Error al crear checkout:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar checkout
export const updateCheckout = (req, res) => {
  const { id } = req.params
  const { fecha_hora, observaciones, id_reserva } = req.body

  const fields = []
  const values = []

  if (fecha_hora !== undefined) { fields.push("fecha_hora = ?"); values.push(fecha_hora) }
  if (observaciones !== undefined) { fields.push("observaciones = ?"); values.push(observaciones) }
  if (id_reserva !== undefined) { fields.push("id_reserva = ?"); values.push(id_reserva) }

  if (fields.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" })

  values.push(id)
  const sql = `UPDATE checkout_repository SET ${fields.join(", ")} WHERE id_checkout = ?`

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Checkout no encontrado" })
    res.json({ message: "Checkout actualizado" })
  })
}

// Eliminar checkout
export const deleteCheckout = (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM checkout_repository WHERE id_checkout = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0) return res.status(404).json({ message: "Checkout no encontrado" })
    res.json({ message: "Checkout eliminado" })
  })
}
