// Contenido proporcionado por Miguel.
export const juanChupeContent = {
  "introduction": "Juan Chupe ERP es un software a la medida creado para digitalizar una operación que durante 12 años se gestionó principalmente en papel.\n\nLa aplicación centraliza ventas, inventario, jornadas, caja, domicilios, gastos, facturación, empleados, nómina y reportes.\n\nMe encargué de analizar la operación, definir los requerimientos y desarrollar la aplicación completa, desde la lógica de negocio y los datos hasta la API y la interfaz.",
  "challengeTitle": "De una operación en papel a un sistema conectado",
  "problem": "Durante años, el cierre diario dependió de registros manuales donde se comparaban ventas, dinero recibido, inventario y vasos vendidos para comprobar si la operación cuadraba.",
  "problemAfterImage": "El reto no era solo reemplazar ese proceso por una interfaz, sino entender cómo se relacionaban las reglas del negocio.\n\nUna sola venta podía afectar inventario, caja, facturación, vendedor, promociones, domicilios y cierre de jornada.\n\nDigitalizar la operación significaba convertir esas relaciones en reglas verificables dentro del sistema.",
  "solution": "La operación comienza con una jornada abierta.\n\nDesde el punto de venta se registra la venta, el vendedor, los productos, sabores, toppings, promociones y método de pago.\n\nA partir de ese registro, el sistema conecta automáticamente el resto de la operación:",
  "solutionSteps": [
    "Venta",
    "Inventario",
    "Facturación",
    "Caja",
    "Domicilio, si aplica",
    "Jornada"
  ],
  "solutionAfterFlow": "Al cierre del día, ventas, gastos, efectivo, transferencias, inventario y entregas por vendedor se consolidan para validar que lo registrado en el sistema coincida con la operación real.",
  "decisions": [
    {
      "title": "Convertir una operación real en reglas de negocio",
      "text": "**Problema:** El proceso original no estaba diseñado como un sistema de software. Muchas reglas existían como parte de la forma cotidiana de trabajar del negocio, no eran claras.\n\n**Decisión:** Antes de implementar funcionalidades, fue necesario identificar entidades, relaciones, responsables y eventos importantes dentro de la operación.\n\nVentas, jornadas, facturas, usuarios, inventario y domicilios dejaron de verse como pantallas independientes y comenzaron a tratarse como partes de un mismo proceso.\n\n**Por qué:** Una interfaz puede digitalizar un formulario, pero eso no significa que haya digitalizado correctamente el negocio.\n\nEl sistema necesitaba representar lo que ocurre antes, durante y después de cada venta.\n\n**Resultado:** Las funcionalidades pudieron conectarse alrededor de un flujo operativo común en lugar de convertirse en módulos aislados."
    },
    {
      "title": "Modelar el consumo real de cada granizado",
      "text": "**Problema:** Una venta no podía descontar inventario como una unidad simple. Cada vaso tiene un tamaño específico y consume una cantidad determinada de granizado proveniente de una bolsa de sabor.\n\n**Decisión:** Relacioné el tamaño del vaso con su capacidad en mililitros y cada sabor con su inventario disponible, permitiendo calcular cuánto producto debía descontarse en cada venta.\n\n**Por qué:** El inventario debía representar el consumo real de materia prima y no solamente la cantidad de productos vendidos.\n\n**Resultado:** Cada venta actualiza automáticamente vasos y sabores según la composición real del producto."
    },
    {
      "title": "Definir correctamente el día operativo",
      "text": "**Problema:** El negocio podía seguir registrando ventas después de la medianoche. Una venta realizada, por ejemplo, a la 1:30 a. m. todavía pertenecía a la jornada del día anterior y no al nuevo día calendario.\n\n**Decisión:** La lógica de jornadas considera las ventas realizadas hasta las 2:00 a. m. como parte del día operativo anterior.\n\n**Por qué:** El sistema debía representar cómo funciona realmente el negocio, no limitarse al cambio de fecha del calendario.\n\n**Resultado:** Las ventas nocturnas permanecen asociadas a la jornada correcta, evitando inconsistencias en cierres, caja y reportes."
    },
    {
      "title": "Restringir el acceso según los días laborales",
      "text": "**Problema:** Las vendedoras no debían poder ingresar al sistema en días diferentes a los asignados en su programación laboral.\n\n**Decisión:** Relacioné los días laborales configurados para cada vendedora con el proceso de autenticación para validar su acceso antes de permitir el ingreso.\n\n**Por qué:** No bastaba con mostrar u ocultar funcionalidades después del login; la restricción debía aplicarse desde el momento en que se intenta acceder al sistema.\n\n**Resultado:** El sistema controla automáticamente qué días puede ingresar cada vendedora según su configuración laboral."
    }
  ],
  "learnings": "Juan Chupe me enseñó a entender el software como un conjunto de procesos conectados, no como pantallas aisladas.\n\nReforcé la importancia de mantener las reglas críticas en backend, conservar trazabilidad sobre los datos y considerar casos borde, pruebas y migraciones desde el desarrollo, especialmente cuando el sistema controla operaciones reales de un negocio.",
  "documents": [
    {
      "file": "caracterizacion-juan-chupe.docx",
      "label": "caracterizacion-juan-chupe.docx"
    },
    {
      "file": "Juan_Chupe_Documento_Requerimientos.pdf",
      "label": "Juan_Chupe_Documento_Requerimientos.pdf"
    },
    {
      "file": "guia_mapa_domicilios.pdf",
      "label": "guia_mapa_domicilios.pdf"
    }
  ]
};
