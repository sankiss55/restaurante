import api from "./api";

 export async function GetInfoOrdenes(){
    try{
        const response=await api.get("/dashboard/info_ordenes");
        if(response.data){
            return response.data;
        }else{
            throw new Error("No se pudo opener la informacon de las ordenes.") ;
        }
    }catch(e:any){
        console.log(e);
    }
}
 export async function GetInfoProductos(){
    try{ 
        const response=await api.get("/dashboard/info_productos");
        if(response.data){
            return response.data;
        }else{
            throw new Error("No se pudo opener la informacon de los productos.") ;
        }
    }catch(e:any){
        console.log(e);
    }
}
 export async function GetInfoUsuarios(){
    try{
       
        const response=await api.get("/dashboard/InfoUsuarios");
        if(response.data){
            return response.data;
        }else{
            throw new Error("No se pudo opener la informacon de los Usuarios.") ;
        }
    }catch(e:any){
        console.log(e);
    }
}
