import type { ImageMetadata } from "astro";
import type { ProjectImage } from "../features/projects/model/project";

// Las vistas se incorporan al compilar cuando su imagen ya existe.
const images = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/projects/juan-chupe/gallery/*.png",
  { eager: true },
);

export const juanChupeGalleryEntries = [
  {
    "file": "inicio-sesion.png",
    "title": "Inicio de sesión",
    "alt": "Juan Chupe ERP: Inicio de sesión",
    "description": "Permite a los usuarios acceder de forma segura al sistema según su rol y las condiciones configuradas para su cuenta.",
    "highlights": [
      "Inicio de sesión con usuario y contraseña",
      "Validación de credenciales",
      "Acceso según rol: Administrador, Vendedor o Domiciliario",
      "Restricción de funciones según permisos",
      "Validación de días laborales para vendedores",
      "Gestión segura de la sesión",
      "Cierre de sesión"
    ]
  },
  {
    "file": "dashboard.png",
    "title": "Inicio / Dashboard",
    "alt": "Juan Chupe ERP: Inicio / Dashboard",
    "description": "Centraliza la información más importante de la operación diaria para conocer rápidamente el estado del negocio.",
    "highlights": [
      "Estado de la jornada actual",
      "Ventas y gastos del día",
      "Efectivo, transferencias y neto en caja",
      "Alertas de inventario",
      "Ventas recientes",
      "Desempeño por vendedor",
      "Estado de los domicilios"
    ]
  },
  {
    "file": "usuarios.png",
    "title": "Usuarios",
    "alt": "Juan Chupe ERP: Usuarios",
    "description": "Permite administrar las personas que utilizan el sistema y controlar qué funciones pueden realizar según su rol.",
    "highlights": [
      "Creación y edición de usuarios",
      "Roles de Administrador, Vendedor y Domiciliario",
      "Activación y desactivación de cuentas",
      "Cambio de contraseñas",
      "Gestión de perfiles y avatar",
      "Control de acceso según el rol"
    ]
  },
  {
    "file": "jornadas.png",
    "title": "Jornadas",
    "alt": "Juan Chupe ERP: Jornadas",
    "description": "Gestiona el inicio y cierre de cada día operativo, reuniendo la información generada durante la operación.",
    "highlights": [
      "Apertura y cierre de jornada",
      "Consulta de jornadas anteriores",
      "Consolidación de ventas y gastos",
      "Control de arqueos",
      "Resumen financiero",
      "Separación por canales de venta",
      "Validaciones antes del cierre"
    ]
  },
  {
    "file": "punto-de-venta.png",
    "title": "Punto de Venta",
    "alt": "Juan Chupe ERP: Punto de Venta",
    "description": "Permite registrar las ventas realizadas directamente en el negocio y procesar todos los elementos asociados a cada pedido.",
    "highlights": [
      "Selección de vasos, sabores y toppings",
      "Asociación de vendedor",
      "Aplicación de promociones",
      "Pagos en efectivo, transferencia o mixtos",
      "Cálculo de cambio",
      "Registro de cortesías",
      "Generación automática de factura",
      "Validación de disponibilidad"
    ]
  },
  {
    "file": "inventario.png",
    "title": "Inventario",
    "alt": "Juan Chupe ERP: Inventario",
    "description": "Controla las existencias de los insumos utilizados durante la operación y registra cómo aumenta o disminuye cada producto.",
    "highlights": [
      "Control de vasos",
      "Control de sabores por mililitros",
      "Control de toppings",
      "Descuento automático por ventas",
      "Devolución por anulaciones",
      "Entradas de mercancía",
      "Ajustes manuales",
      "Alertas de stock mínimo",
      "Historial de movimientos"
    ]
  },
  {
    "file": "productos.png",
    "title": "Productos",
    "alt": "Juan Chupe ERP: Productos",
    "description": "Permite configurar los productos e insumos que pueden utilizarse durante las ventas.",
    "highlights": [
      "Gestión de sabores",
      "Gestión de tamaños de vaso",
      "Gestión de toppings",
      "Precios y cantidades",
      "Categorías de productos",
      "Configuración de stock mínimo",
      "Activación y desactivación de productos"
    ]
  },
  {
    "file": "promociones.png",
    "title": "Promociones",
    "alt": "Juan Chupe ERP: Promociones",
    "description": "Gestiona las promociones disponibles para las ventas realizadas directamente o mediante plataformas externas.",
    "highlights": [
      "Creación y edición de promociones",
      "Activación y desactivación",
      "Promociones para POS",
      "Promociones para Rappi y DiDi",
      "Asociación con productos",
      "Cálculo de precios promocionales",
      "Cálculo de comisiones de plataformas"
    ]
  },
  {
    "file": "facturacion.png",
    "title": "Facturación",
    "alt": "Juan Chupe ERP: Facturación",
    "description": "Mantiene el registro de las facturas generadas por las ventas y permite controlar sus anulaciones.",
    "highlights": [
      "Generación automática de facturas",
      "Numeración única",
      "Consulta y búsqueda",
      "Filtrado por jornada",
      "Visualización del detalle de venta",
      "Anulación de facturas",
      "Registro del motivo de anulación",
      "Reintegro automático de inventario"
    ]
  },
  {
    "file": "domicilios.png",
    "title": "Domicilios",
    "alt": "Juan Chupe ERP: Domicilios",
    "description": "Permite administrar los pedidos que requieren entrega y realizar seguimiento a cada domicilio.",
    "highlights": [
      "Registro de cliente y dirección",
      "Asociación con una venta",
      "Asignación de domiciliario",
      "Estados del domicilio",
      "Seguimiento de entregas",
      "Registro de fecha de entrega",
      "Cancelación de domicilios",
      "Control de pedidos activos"
    ]
  },
  {
    "file": "mapa-domicilios.png",
    "title": "Mapa de domicilios",
    "alt": "Juan Chupe ERP: Mapa de domicilios",
    "description": "Permite visualizar geográficamente las entregas realizadas y las ubicaciones registradas por el negocio.",
    "highlights": [
      "Ubicación de domicilios",
      "Selección de direcciones desde el mapa",
      "Consulta por rango de fechas",
      "Visualización de puntos históricos",
      "Mapa de calor de zonas de entrega"
    ]
  },
  {
    "file": "gastos-compras.png",
    "title": "Gastos y compras",
    "alt": "Juan Chupe ERP: Gastos y compras",
    "description": "Controla las salidas de dinero y las compras relacionadas con la operación diaria.",
    "highlights": [
      "Registro de gastos",
      "Clasificación por categoría",
      "Medio de pago",
      "Separación entre POS y domicilios",
      "Gastos que afectan caja",
      "Registro de compras",
      "Asociación con la jornada",
      "Historial de movimientos"
    ]
  },
  {
    "file": "arqueo-caja.png",
    "title": "Arqueo de caja",
    "alt": "Juan Chupe ERP: Arqueo de caja",
    "description": "Permite comparar el dinero que debería existir según el sistema con el dinero realmente entregado al finalizar la operación.",
    "highlights": [
      "Arqueo de POS y domicilios",
      "Efectivo esperado",
      "Transferencias esperadas",
      "Gastos en efectivo",
      "Efectivo real entregado",
      "Diferencias de caja",
      "Entregas por vendedor",
      "Validaciones antes del cierre"
    ]
  },
  {
    "file": "arqueo-inventario.png",
    "title": "Arqueo de inventario",
    "alt": "Juan Chupe ERP: Arqueo de inventario",
    "description": "Permite comparar las existencias iniciales y finales de productos durante cada jornada.",
    "highlights": [
      "Inventario inicial",
      "Entradas durante la jornada",
      "Registro de stock final",
      "Cálculo de producto disponible",
      "Cálculo de producto vendido",
      "Control de vasos y toppings",
      "Comparación con jornadas anteriores"
    ]
  },
  {
    "file": "reportes.png",
    "title": "Reportes",
    "alt": "Juan Chupe ERP: Reportes",
    "description": "Transforma la información registrada en el sistema en indicadores para analizar la operación del negocio.",
    "highlights": [
      "Reportes diarios",
      "Reportes semanales",
      "Reportes mensuales",
      "Reportes por rango de fechas",
      "Ventas por vendedor",
      "Productos y sabores más vendidos",
      "Gastos por categoría",
      "Estadísticas de domicilios",
      "Distribución de medios de pago",
      "Reportes de Rappi y DiDi"
    ]
  },
  {
    "file": "asistencia.png",
    "title": "Asistencia",
    "alt": "Juan Chupe ERP: Asistencia",
    "description": "Registra la entrada y salida de los empleados durante las jornadas de trabajo.",
    "highlights": [
      "Registro de entrada",
      "Registro de salida",
      "Estado de asistencia diario",
      "Cálculo de horas trabajadas",
      "Historial por fechas",
      "Métricas por empleado",
      "Validación de jornada activa"
    ]
  },
  {
    "file": "nomina.png",
    "title": "Nómina",
    "alt": "Juan Chupe ERP: Nómina",
    "description": "Permite controlar los días trabajados y los pagos correspondientes a cada vendedor.",
    "highlights": [
      "Configuración de días laborales",
      "Tarifas por día",
      "Registro de días trabajados",
      "Cálculo del valor ganado",
      "Días pendientes de pago",
      "Registro de pagos",
      "Historial de nómina",
      "Resumen por empleado"
    ]
  },
  {
    "file": "metodos-pago.png",
    "title": "Métodos de pago",
    "alt": "Juan Chupe ERP: Métodos de pago",
    "description": "Permite configurar las cuentas y medios utilizados para recibir transferencias durante las ventas.",
    "highlights": [
      "Gestión de métodos de transferencia",
      "Proveedor y nombre visible",
      "Número de cuenta o celular",
      "Códigos QR",
      "Activación y desactivación",
      "Orden de visualización",
      "Consulta desde el POS"
    ]
  }
] as const;

export const juanChupeGallery: readonly ProjectImage[] = juanChupeGalleryEntries.flatMap(
  ({ file, ...entry }) => {
    const image = images[`../assets/projects/juan-chupe/gallery/${file}`]?.default;
    return image ? [{ ...entry, src: image }] : [];
  },
);
