/**
 * Utilidad para manejo de subida de imágenes de productos
 * Guardarlas localmente y retornar la ruta relativa para la BD
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = '/images/productos/';

interface UploadResult {
  success: boolean;
  rutaRelativa?: string;
  error?: string;
}

/**
 * Valida un archivo de imagen
 * @param file - Archivo a validar
 * @returns Objeto con validación y error si existe
 */
const validarImagen = (file: File): { valido: boolean; error?: string } => {
  // Validar tipo
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valido: false,
      error: 'Solo se permiten imágenes en formato JPEG, PNG o WebP',
    };
  }

  // Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    return {
      valido: false,
      error: 'La imagen no debe exceder 5MB',
    };
  }

  return { valido: true };
};

/**
 * Genera un nombre único para el archivo
 * @param nombreProducto - Nombre del producto
 * @param extensionOriginal - Extensión del archivo original
 * @returns Nombre único con timestamp
 */
const generarNombreUnico = (nombreProducto: string, extensionOriginal: string): string => {
  const timestamp = Date.now();
  const nombreLimpio = nombreProducto
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 20);

  return `producto_${timestamp}_${nombreLimpio}.${extensionOriginal}`;
};

/**
 * Obtiene la extensión del archivo
 * @param file - Archivo
 * @returns Extensión sin punto
 */
const obtenerExtension = (file: File): string => {
  const tipos: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return tipos[file.type] || 'jpg';
};

/**
 * Guarda la imagen localmente en el navegador usando IndexedDB simulado
 * y retorna la ruta relativa para guardar en BD
 * @param file - Archivo de imagen
 * @param nombreProducto - Nombre del producto (para generar nombre único)
 * @returns Promesa con resultado de subida
 */
export const guardarImagenProducto = async (
  file: File,
  nombreProducto: string
): Promise<UploadResult> => {
  try {
    // Validar imagen
    const validacion = validarImagen(file);
    if (!validacion.valido) {
      return {
        success: false,
        error: validacion.error,
      };
    }

    // Generar nombre único
    const extension = obtenerExtension(file);
    const nombreArchivo = generarNombreUnico(nombreProducto, extension);
    const rutaRelativa = `${UPLOAD_DIR}${nombreArchivo}`;

    // Leer el archivo como Data URL
    const dataUrl = await leerArchivoComoDataUrl(file);

    // Guardar en localStorage (simulación de almacenamiento local)
    // En una app real, esto iría a un servidor, pero aquí lo guardamos localmente
    guardarEnLocal(nombreArchivo, dataUrl);

    return {
      success: true,
      rutaRelativa,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al procesar la imagen',
    };
  }
};

/**
 * Lee un archivo como Data URL
 * @param file - Archivo a leer
 * @returns Promesa con Data URL
 */
const leerArchivoComoDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
};

/**
 * Guarda la imagen en localStorage con un límite de tamaño
 * @param nombreArchivo - Nombre del archivo
 * @param dataUrl - Data URL de la imagen
 */
const guardarEnLocal = (nombreArchivo: string, dataUrl: string): void => {
  try {
    const key = `img_${nombreArchivo}`;

    // Verificar tamaño disponible en localStorage (aproximadamente 5-10MB por navegador)
    const itemSize = new Blob([dataUrl]).size;
    const currentSize = Object.keys(localStorage).reduce((total, key) => {
      return total + (localStorage.getItem(key)?.length || 0);
    }, 0);

    if (currentSize + itemSize > 8 * 1024 * 1024) {
      // Limpiar imágenes más antiguas si se aproxima al límite
      limpiarImagenesAntiguasLocal();
    }

    localStorage.setItem(key, dataUrl);
  } catch (error: any) {
    console.warn('No se pudo guardar en localStorage:', error.message);
    // Continuar de todas formas, la ruta se guardará en la BD
  }
};

/**
 * Limpia imágenes antiguas del localStorage cuando se acerca al límite
 */
const limpiarImagenesAntiguasLocal = (): void => {
  // Obtener todas las imágenes guardadas y ordenarlas por antigüedad
  const imagenesGuardadas: { [key: string]: string } = {};

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('img_')) {
      imagenesGuardadas[key] = localStorage.getItem(key) || '';
    }
  });

  // Eliminar las 5 más antiguas (por timestamp en el nombre)
  const imagenesOrdenadas = Object.keys(imagenesGuardadas)
    .sort()
    .slice(0, 5);

  imagenesOrdenadas.forEach((key) => {
    localStorage.removeItem(key);
  });
};

/**
 * Obtiene una imagen guardada localmente
 * @param nombreArchivo - Nombre del archivo
 * @returns Data URL o null si no existe
 */
export const obtenerImagenLocal = (nombreArchivo: string): string | null => {
  const key = `img_${nombreArchivo}`;
  return localStorage.getItem(key);
};

/**
 * Elimina una imagen guardada localmente
 * @param nombreArchivo - Nombre del archivo
 */
export const eliminarImagenLocal = (nombreArchivo: string): void => {
  const key = `img_${nombreArchivo}`;
  localStorage.removeItem(key);
};

/**
 * Obtiene la URL pública de una imagen guardada
 * (Para su uso en <img src={...} />)
 * @param rutaRelativa - Ruta relativa de la imagen (ej: /images/productos/producto_123.jpg)
 * @returns URL completa o data URL si está en localStorage
 */
export const obtenerUrlImagen = (rutaRelativa: string): string => {
  const nombreArchivo = rutaRelativa.split('/').pop();

  // Intentar obtener de localStorage primero
  if (nombreArchivo) {
    const dataUrl = obtenerImagenLocal(nombreArchivo);
    if (dataUrl) {
      return dataUrl;
    }
  }

  // Si no está en localStorage, retornar la ruta relativa
  // (suponiendo que está en public/)
  return rutaRelativa;
};
