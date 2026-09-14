// Vistas pendientes de recibir sus archivos de imagen.
export const pendingTuCanchaViews = [
  {
    file: 'unete.png', title: 'Únete',
    alt: 'Vista de registro de nuevos usuarios en TuCancha',
    description: 'Sección orientada a nuevos usuarios que quieren crear una cuenta y comenzar a utilizar las funciones de TuCancha.',
    highlights: ['Registro de nuevos usuarios', 'Creación de cuenta', 'Acceso posterior a funcionalidades personales', 'Inicio del flujo para reservar canchas', 'Acceso al registro de complejos, según el tipo de usuario'],
  },
  {
    file: 'iniciar-sesion.png', title: 'Iniciar sesión',
    alt: 'Vista de inicio de sesión de usuarios en TuCancha',
    description: 'Permite que un usuario registrado acceda a su cuenta y utilice las funciones asociadas a su sesión.',
    highlights: ['Autenticación de usuarios registrados', 'Acceso a la cuenta personal', 'Visualización de reservas', 'Continuidad del proceso de reserva', 'Opción para cerrar sesión', 'Manejo de sesión del usuario dentro de la plataforma'],
  },
  {
    file: 'pagar-reserva.png', title: 'Pagar reserva',
    alt: 'Vista de confirmación y pago de una reserva en TuCancha',
    description: 'Permite revisar la reserva seleccionada y completar el proceso de pago.',
    highlights: ['Resumen de la cancha, fecha, horario y duración', 'Visualización del precio total', 'Opción para eliminar la reserva', 'Selección del método de pago', 'Pago con tarjeta, Nequi o Daviplata', 'Confirmación final del pago'],
  },
  {
    file: 'mis-reservas.png', title: 'Mis reservas',
    alt: 'Vista de gestión de reservas de un usuario en TuCancha',
    description: 'Permite al usuario consultar y gestionar las reservas asociadas a su cuenta.',
    highlights: ['Reservas próximas, completadas y canceladas', 'Filtros y orden por fecha', 'Detalle completo de cada reserva', 'Información de fecha, hora, duración y precio', 'Método de pago', 'Opción para modificar o cancelar la reserva'],
  },
  {
    file: 'registro-complejo.png', title: 'Registro de complejo',
    alt: 'Vista del proceso de registro de un complejo deportivo en TuCancha',
    description: 'Permite a propietarios registrar su complejo deportivo paso a paso antes de enviarlo a revisión.',
    highlights: ['Datos del titular', 'Información del complejo', 'Selección de prestaciones y servicios', 'Registro de una o varias canchas', 'Carga de fotografías', 'Revisión final de la información', 'Seguimiento del progreso durante el registro'],
  },
] as const;

export const tuCanchaGalleryOrder = [
  'inicio.png', 'canchas.png', 'unete.png', 'iniciar-sesion.png',
  'pagar-reserva.png', 'mis-reservas.png', 'registro-complejo.png',
  'nosotros.png', 'contacto.png',
] as const;
