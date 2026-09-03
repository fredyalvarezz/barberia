Barbería 

### 🔑 Usuario administrador de demostración

Correo: admin@barberia.com
Contraseña: admin123

Aplicación web para la gestión y reserva de citas de una barbería.

El proyecto permite a los clientes registrarse, consultar los servicios disponibles, seleccionar una fecha y horario, reservar una cita y consultar su historial.

También cuenta con un panel de administración desde donde se pueden gestionar las citas y administrar el catálogo de servicios.

Funcionalidades
  Clientes
  Registro e inicio de sesión.
  Gestión del perfil.
  Visualización de servicios disponibles.
  Selección de servicio.
  Selección de fecha.
  Visualización de horarios disponibles.
  Reserva de citas.
  Agregar especificaciones sobre el corte.
  Consulta de próximas citas.
  Consulta del historial de citas.
  Cancelación de citas.

Administrador
  Acceso mediante ruta protegida.
  Dashboard con resumen de citas.
  Consulta de citas por fecha.
  Confirmación de citas.
  Marcado de citas como completadas.
  Cancelación de citas.
  Gestión del catálogo de servicios.
  Creación de nuevos servicios.
  Activación y desactivación de servicios.
  Eliminación de servicios.
  Visualización de estadísticas básicas e ingresos estimados.

Tecnologías
  React
  JavaScript
  Vite
  React Router
  Context API
  CSS
  LocalStorage



Gestión del estado

Se utiliza Context API para compartir información entre diferentes partes de la aplicación:

AuthContext: usuarios, sesión, registro, inicio de sesión y roles.
ServicesContext: servicios disponibles y administración del catálogo.
AppointmentsContext: creación, consulta, cancelación y actualización de citas.
Persistencia

Actualmente la aplicación utiliza localStorage como mecanismo de persistencia en el navegador.

Se creó una pequeña capa de acceso a datos para centralizar las operaciones de lectura y escritura, permitiendo que en el futuro pueda reemplazarse por una API sin modificar directamente los contextos.

Autenticación y rutas protegidas
  La aplicación cuenta con diferentes niveles de acceso:

  Clientes autenticados.
  Administrador.

Las rutas protegidas verifican la sesión del usuario y, en el caso del panel administrativo, también validan el rol correspondiente.


Flujo de reserva

El proceso de reserva está dividido en diferentes pasos:

Servicio
   ↓
Fecha
   ↓
Hora
   ↓
Notas
   ↓
Confirmación


Antes de crear una cita se verifica que el horario seleccionado no haya sido reservado previamente.

Las citas comienzan con estado pending y pueden ser gestionadas posteriormente desde el panel administrativo.



Los horarios disponibles actualmente están definidos en bloques de una hora:

09:00
10:00
11:00
12:00
13:00
14:00
15:00
16:00
17:00
18:00


Autor
Fredy Alvarez

LinkedIn:
https://www.linkedin.com/in/fredyalvarez-webdeveloper/