import {  BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriaProductoEntitie } from "src/entities/categoria.entitie";
import { ILike, Repository } from "typeorm";
import { CategoriasModificarPDO, CategoriasProductosDTO } from "src/dtos/categorias_productos";
import { ProductosEntitie } from "src/entities/productos.entitie";
import { ModelResponce } from "src/responces/ModelResponse";
import { isEmpty, isNotEmpty } from "class-validator";
@Injectable()
export class CategoriasServices{
    constructor(@InjectRepository(CategoriaProductoEntitie) private readonly CategoriasProductos:Repository<CategoriaProductoEntitie>, @InjectRepository(ProductosEntitie) private readonly ProductosEntitie:Repository<ProductosEntitie>){}
    async BuscarCategorias(categoria?:string){
        const value=categoria?.trim();
        if(!value || isEmpty(value)) return null;
        return await this.CategoriasProductos.findOneBy({
            categoria:ILike(value)
        });
    }
     async CrearCategoria({descripcion, categoria}:CategoriasProductosDTO){
        const data= await this.BuscarCategorias(categoria);
        if(categoria.toLowerCase()===data?.categoria?.toLowerCase()){
            throw new ConflictException("La categoria ya existe en el sistema, porfavor valida la categoria ingresada.");
        }
        await this.CategoriasProductos.manager.transaction("SERIALIZABLE", async(transactionCategorias)=>{
            transactionCategorias.insert(CategoriaProductoEntitie,{
                categoria,
                descripcion
            })
        });
    }
    async BuscarCategoriaById(id:number)
    {
        return await this.CategoriasProductos.findOneBy({
            id
        });
    }
    async EliminarCategoria(id:number):Promise<ModelResponce>{
        const categoria=this.BuscarCategoriaById(id);
        if(categoria===null){
             throw new ConflictException("La categoria no existe, porfavor de verificar.");
        }
        const data=await this.ProductosEntitie.find({
            relations:{
                id_categoria:true
            },
            where:{
                id_categoria:{
                    id:id,
                }
            }
        });
        if( data.length>0){
            throw new ConflictException("No se puede borrar la categoria ya que esta relacionada con los productos actuales.");
        }
        return await this.CategoriasProductos.manager.transaction("SERIALIZABLE",async (transactionCategoria)=>{
            const response= await transactionCategoria.delete(CategoriaProductoEntitie,id);
            if(response.affected===0){
                throw new ConflictException("No se pudo borrar la categoria, porfavor confirma la categoria que desea borrar.");
            }
            return {
                status:'success',
                message:'Se borro exitosamente la categoria.'
            }
        })
    }
    async TraerCategorias(categoria:string):Promise<ModelResponce>{
        categoria=categoria.trim();
        const data= categoria.length>0&&isNotEmpty(categoria)?await this.CategoriasProductos.findBy({
             categoria:ILike(categoria)
        }): await this.CategoriasProductos.find();
        if(data.length===0){
            return {
                status:'success',
                message:"No hay categorias en el sistema",
                data:[]
            }
        }
        return {
            status:'success',
            message:"Categorias encontradas.",
            data:data,
        }
    }
    async ModificarInfo({categoria,descripcion, id}:CategoriasModificarPDO):Promise<ModelResponce>{
            if(!id){
                throw new BadRequestException("El id es requerido para modificar la categoria.");
            }

            const current=await this.CategoriasProductos.findOneBy({ id });
            if(current===null){
                throw new ConflictException("La categoria no existe, porfavor de verificar.");
            }

            const updateData:Partial<CategoriaProductoEntitie>={};

            if(typeof descripcion==='string'){
                const descripcionValue=descripcion.trim();
                if(isEmpty(descripcionValue)){
                    throw new BadRequestException("La descripcion debe que contener informacion.");
                }
                updateData.descripcion=descripcionValue;
            }

            if(typeof categoria==='string'){
                const categoriaValue=categoria.trim();
                if(isEmpty(categoriaValue)){
                    throw new BadRequestException("La categoria debe que contener informacion.");
                }

                const isSameCategory=current.categoria?.toLowerCase()===categoriaValue.toLowerCase();
                if(!isSameCategory){
                    const existing=await this.BuscarCategorias(categoriaValue);
                    if(existing!==null && existing.id!==id){
                        throw new ConflictException("La categoria ingresada ya existe.");
                    }
                }
                updateData.categoria=categoriaValue;
            }

            if(Object.keys(updateData).length===0){
                throw new BadRequestException("No hay datos para modificar.");
            }

            return await this.CategoriasProductos.manager.transaction("SERIALIZABLE", async(transactionCategorias)=>{
                const response= await transactionCategorias.update(CategoriaProductoEntitie,id, updateData);
                if(response.affected===0){
                        throw new InternalServerErrorException("No se pudo modificar la informacion.")
                }
                return {
                        status:'success',
                        data:[],
                        message:'Se modifico exitosamente'
                }
            });
    }
}