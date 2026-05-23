
export default function extractJWT(data:string):string{
    if(data.trim()===""||data===""|| data.trim().length==0|| !data){
        throw new Error("El campo JWT esta vacio, enviar uno que contenga contenido");
    }
    const JWT_code=data.split(" ");
    if(JWT_code.length<2){
        throw new Error("Formato de JWT inválido. Debe ser 'Bearer <token>'");
    }
    return JWT_code[1];
}