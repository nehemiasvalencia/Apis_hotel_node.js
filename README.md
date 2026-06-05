# API Hotel

API REST desarrollada con Node.js, Express y MySQL para la administración integral de un sistema hotelero.

## Características

* Gestión de usuarios y tipos de usuario.
* Gestión de personal y roles.
* Administración de habitaciones y tipos de habitación.
* Gestión de reservas.
* Gestión de servicios y servicios asociados a reservas.
* Administración de mantenimientos.
* Gestión de métodos de pago.
* Facturación y detalle de facturas.
* Procesos de check-in y check-out.

## Tecnologías Utilizadas

* Node.js
* Express.js
* MySQL
* JavaScript (ES Modules)
* CORS

## Endpoints Principales

| Módulo              | Endpoint              |
| ------------------- | --------------------- |
| Usuarios            | `/api/usuario`        |
| Tipos de Usuario    | `/api/tipo_usuario`   |
| Turnos              | `/api/turno`          |
| Habitaciones        | `/api/habitacion`     |
| Tipos de Habitación | `/api/tipoHabitacion` |
| Reservas            | `/api/reserva`        |
| Servicios           | `/api/servicio`       |
| Facturas            | `/api/factura`        |
| Check-In            | `/api/checkin`        |
| Check-Out           | `/api/checkout`       |

## Instalación

Instalar dependencias:

```bash
npm install
```

Configurar las variables de conexión a la base de datos.

Ejecutar el servidor:

```bash
npm start
```

o

```bash
node app.js
```

## Arquitectura

```text
Routes/
Controllers/
Config/
app.js
```

## Autor

Nehemias Valencia
