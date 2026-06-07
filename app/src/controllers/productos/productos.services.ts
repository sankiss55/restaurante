import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductosCreatePDO, ProductosFilterDTO, ProductosUpdateDTO } from "src/dtos/Productos";
import { ProductosEntitie } from "src/entities/productos.entitie";
import { ILike, Repository } from "typeorm";
import { CategoriasServices } from "../categorias_productos/categorias.services";
import { ModelResponce } from "src/responces/ModelResponse";

@Injectable()
export class ProductosServces{
    constructor(@InjectRepository(ProductosEntitie) private readonly ProductosBD:Repository<ProductosEntitie>, private readonly CategoriasServices:CategoriasServices){}

    async BuscarProductoByNombre(nombre:string){
        return await this.ProductosBD.findBy({
            nombre:ILike(nombre.trim())
        })
    }

    async BuscarProductosByFiltro(filtro: ProductosFilterDTO): Promise<ProductosEntitie[]> {
    const query = this.ProductosBD.createQueryBuilder('p')
        .leftJoinAndSelect('p.id_categoria', 'categoria');

    if (filtro.nombre) {
        query.andWhere('p.nombre ILIKE :nombre', { nombre: `%${filtro.nombre.trim()}%` });
    }

    if (filtro.precio !== undefined) {
        query.andWhere('p.precio = :precio', { precio: filtro.precio });
    }

    if (filtro.disponibilidad !== undefined) {
        query.andWhere('p.disponibilidad = :disponibilidad', { disponibilidad: filtro.disponibilidad });
    }

    if (filtro.id_categoria !== undefined) {
        query.andWhere('categoria.id = :id_categoria', { id_categoria: filtro.id_categoria });
    }

    return await query.getMany();
}

    async ActualizarProducto(id: number, dataActualizar: ProductosUpdateDTO): Promise<ModelResponce> {
        const productoExistente = await this.ProductosBD.findOne({ where: { id } });
        
        if (!productoExistente) {
            throw new NotFoundException(`El producto con id ${id} no existe en el sistema.`);
        }
        
        // Si el nombre cambió, validar que no exista otro producto con ese nombre
        if (dataActualizar.nombre && dataActualizar.nombre !== productoExistente.nombre) {
            const productoConNombre = await this.BuscarProductoByNombre(dataActualizar.nombre);
            if (productoConNombre.length > 0) {
                throw new ConflictException("El nombre ingresado ya existe en otro producto.");
            }
        }
        
        // Si la categoría cambió, validar que exista
        if (dataActualizar.id_categoria !== undefined && dataActualizar.id_categoria !== productoExistente.id_categoria?.id) {
            const categoriaExistente = await this.CategoriasServices.BuscarCategoriaById(dataActualizar.id_categoria);
            if (!categoriaExistente) {
                throw new ConflictException("La categoria que ingresaste no existe en el sistema.");
            }
        }
        
        const date_modification = new Date();
        const dataActualizada = {
            ...productoExistente,
            ...dataActualizar,
            date_modification,
            id_categoria: dataActualizar.id_categoria ? { id: dataActualizar.id_categoria } : productoExistente.id_categoria
        };
        
        const productoActualizado = await this.ProductosBD.save(dataActualizada);
        
        return {
            status: 'success',
            data: [productoActualizado],
            message: 'El producto se actualizó exitosamente.'
        };
    }
    async CrearProducto({nombre, ingredientes,precio,imagen,disponibilidad,id_categoria}:ProductosCreatePDO):Promise<ModelResponce>{
        const data=await this.CategoriasServices.BuscarCategoriaById(id_categoria);
        if(data===null){
            throw new ConflictException("La categoria que ingresaste no existe en el sistema");
        }
        const response=await this.BuscarProductoByNombre(nombre);
        if(response.length>0)
        {
            throw new ConflictException("El nombre ingresado ya existe en otro producto.")
        }
        return await this.ProductosBD.manager.transaction("SERIALIZABLE", async(transactionProductos)=>{
            const creation_date=new Date();
            const productoCreado = await transactionProductos.save(ProductosEntitie, {
                nombre,
                ingredientes,
                precio,
                imagen,
                disponibilidad,
                creation_date,
                date_modification:creation_date,
                id_categoria:{id:id_categoria}
            });
            return {
                status:'success',
                data:[productoCreado],
                message:'El producto se creo exitosamente.'
            }
        })
    }
    async CambiarDisponibilidad(id:number, disponibilidad:boolean): Promise<ModelResponce>{
        const findProducto=await this.ProductosBD.findOne({ where: { id } })
        if(findProducto===null){
            throw new NotFoundException(`El producto con id ${id} no existe en el sistema.`);
        }
        return this.ProductosBD.manager.transaction("SERIALIZABLE", async(transacionProductos)=>{
            await transacionProductos.update(ProductosEntitie, id, {
                disponibilidad
            });
            return{
                status:'success',
                data:[],
                message:"El producto se ha modificado exitosamnte."
            }
        })
    }
}