import { Body, Controller, Post, Get, Patch, Param, Query, ParseIntPipe, HttpStatus, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { ProductosServces } from "./productos.services";
import { ProductosFilterDTO, ProductosUpdateDTO } from "src/dtos/Productos";
import { ModelResponce } from "src/responces/ModelResponse";
import { ExceptionsResponse } from "src/responces/ExceptionsResponces";

@Controller("productos")
@ApiTags("Productos")
@ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Error de validación en los datos enviados', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.CONFLICT, description: 'Conflicto: duplicado de nombre o categoría inválida', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Recurso no encontrado', type: ExceptionsResponse})
export class ProductosController{
    constructor(private readonly ProductosServices:ProductosServces){}

    @Post("crear_producto")
@ApiConsumes('multipart/form-data')
@UseInterceptors(FileInterceptor('imagen', {
  storage: diskStorage({
    destination: './uploads/productos',  // 👈 crea la carpeta automáticamente
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = extname(file.originalname);
      cb(null, `producto_${timestamp}${ext}`);  // 👈 nombre del archivo
    }
  })
}))
async CrearProducto(
  @Body() data: any,
  @UploadedFile() imagen: Express.Multer.File
): Promise<ModelResponce> {
  const imagenRuta = `/uploads/productos/${imagen.filename}`;
  return await this.ProductosServices.CrearProducto({
    ...data,
    precio: parseFloat(data.precio),
    disponibilidad: data.disponibilidad === 'true',
    id_categoria: parseInt(data.id_categoria),
    imagen: imagenRuta,  
  });
}

    @Get("buscar")
    @ApiOperation({ summary: 'Buscar productos con filtros opcionales', description: 'Busca productos en el sistema. Si no proporciona filtros, devuelve todos los productos. Los filtros son opcionales y se pueden combinar.' })
    @ApiResponse({ status: 200, description: 'Búsqueda completada exitosamente', type: ModelResponce })
    async BuscarProductos(@Query() filtro: ProductosFilterDTO): Promise<ModelResponce> {
        const productos = await this.ProductosServices.BuscarProductosByFiltro(filtro);
        return {
            status: 'success',
            data: productos,
            message: `Se encontraron ${productos.length} producto(s).`
        };
    }
@Patch("modificar/:id")
@UseInterceptors(FileInterceptor('imagen', {
  storage: diskStorage({
    destination: './uploads/productos',
    filename: (req, file, cb) => {
      cb(null, `producto_${Date.now()}${extname(file.originalname)}`);
    }
  })
}))
async ActualizarProducto(
  @Param("id", ParseIntPipe) id: number,
  @Body() data: any,
  @UploadedFile() imagen?: Express.Multer.File
): Promise<ModelResponce> { 
  const updateData: any = {
    ...data,
    precio: data.precio ? parseFloat(data.precio) : undefined,
    disponibilidad: data.disponibilidad !== undefined ? data.disponibilidad === 'true' : undefined,
    id_categoria: data.id_categoria.id ? parseInt(data.id_categoria.id) : undefined,
  };
  if (imagen) {
    updateData.imagen = `/uploads/productos/${imagen.filename}`; 
  }
  return await this.ProductosServices.ActualizarProducto(id, updateData);
}

    @Patch("cambiar_disponibilidad/:id")
    @ApiBody({
       schema:{
        example:{
            disponibilidad:true
        }
       }
    })
    async CambiarDisponibilidad(@Param("id", ParseIntPipe) id:number, @Body("disponibilidad") disponibilidad:boolean):Promise<ModelResponce>{
        return await this.ProductosServices.CambiarDisponibilidad(id,disponibilidad);
    }
}