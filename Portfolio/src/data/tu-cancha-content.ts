import desarrolloEquipo from '../assets/projects/tu-cancha/desarrollo-equipo.jpeg';
import revisionFigma from '../assets/projects/tu-cancha/revision-figma.jpeg';

// Contenido proporcionado por Miguel para la página de Tu Cancha.
export const tuCanchaContent = {
  introduction: `**TuCancha** es una plataforma para digitalizar la gestión y reserva de canchas deportivas. Permite registrar complejos y canchas, gestionar su publicación y consultar horarios disponibles para reservar.

Trabajé en el proyecto como parte de un equipo Full Stack, con foco principalmente en el **backend de canchas y horarios con Java y Spring Boot**, además de participar en vistas del proceso de registro y reserva.`,
  problem: `El reto era conectar procesos que dependían entre sí sin perder consistencia: un complejo puede tener varias canchas, cada cancha múltiples horarios y esos horarios posteriormente participan en una reserva.

Además, el proyecto se desarrolló en equipo y por módulos. Esto exigía integrar entidades creadas por otros compañeros sin modificar sus responsabilidades y controlar reglas importantes, como impedir que una cancha tuviera horarios superpuestos.`,
  solution: `El flujo comienza con el registro del complejo y sus canchas. La información puede pasar por revisión administrativa antes de ser publicada.

Una vez disponible, cada cancha mantiene sus características, fotografías y horarios. El backend permite consultar canchas y recuperar la disponibilidad para una fecha determinada, preparando la información necesaria para que el usuario pueda seleccionar un turno y continuar con el proceso de reserva.`,
  decisions: [
    {
      title: 'Evitar conflictos entre horarios',
      text: `**Problema:** una cancha no podía tener dos turnos que ocuparan el mismo intervalo.

**Decisión:** incorporamos una validación que comprueba si un nuevo horario se cruza con otro existente antes de guardarlo.

**Por qué:** validar únicamente la hora inicial y final no era suficiente para proteger la disponibilidad real.

**Resultado:** el sistema puede rechazar turnos incompatibles antes de persistirlos.`,
    },
    {
      title: 'Separar la API del modelo de datos',
      text: `**Problema:** devolver directamente las entidades podía generar respuestas innecesariamente acopladas a sus relaciones.

**Decisión:** separar entrada, persistencia y respuesta mediante DTOs.

**Por qué:** permitía controlar exactamente qué información recibe y devuelve cada endpoint.

**Resultado:** una API más clara para consumir desde el frontend y con menor dependencia de la estructura interna de las entidades.`,
    },
    {
      title: 'Integrar módulos sin interferir con el equipo',
      images: [
        { src: desarrolloEquipo, alt: 'Sesión de trabajo del equipo de Tu Cancha con código abierto en VS Code' },
        { src: revisionFigma, alt: 'Revisión en equipo de las pantallas de Tu Cancha en Figma' },
      ],
      text: '**Problema:** mi módulo dependía de `Complejo`, desarrollado por otra persona, mientras que `Reserva` dependía posteriormente de `Horario`.\n\n**Decisión:** trabajar por responsabilidades y ramas separadas, consumiendo los módulos de otros integrantes sin modificar sus archivos.\n\n**Por qué:** reducía conflictos y hacía explícitas las dependencias entre áreas.\n\n**Resultado:** fue posible desarrollar el módulo de canchas y horarios de forma independiente y prepararlo para su integración.',
    },
  ],
  learnings: `El proyecto me ayudó a entender mejor cómo una decisión de modelado termina afectando toda la aplicación: entidades, relaciones, consultas, servicios y endpoints.

También reforcé la diferencia entre **validar datos recibidos** y **aplicar reglas de negocio**. Un campo obligatorio puede validarse al entrar a la API, mientras que detectar horarios superpuestos requiere lógica del dominio.

A nivel de equipo, aprendí a identificar dependencias antes de programar y evitar modificar componentes que pertenecían a otro módulo.`,
  result: `Mi trabajo dejó estructurado el módulo de **canchas y horarios**, incluyendo entidades, DTOs, repositorios, servicios y endpoints REST para registrar, consultar y actualizar información.

También se implementó la lógica necesaria para consultar disponibilidad y prevenir cruces entre horarios de una misma cancha.

El módulo quedó diseñado para integrarse con los procesos de **complejos, solicitudes y reservas**, manteniendo separadas las responsabilidades de cada parte del sistema.`,
};
