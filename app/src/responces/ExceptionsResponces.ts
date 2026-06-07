import { ApiProperty } from "@nestjs/swagger";

export class ExceptionsResponse{
    @ApiProperty({type:'number', description:'El codigo de respuesta HTTP que regreso el servidor.', example:400, nullable:false})
    code!:number

    @ApiProperty({type:'string', description:'El estado en la que se regresa la respuesta al cliente.', example:'error', nullable:false})
    status!:string
    
    @ApiProperty({type:'string', description:'Describe el error que sucedio.', example:'Error al crear la accion.', nullable:false})
    message!:string

    @ApiProperty({type:'object', description:'El objeto con toda la informacion del error.', nullable:false, additionalProperties:true})
    error!:Object

    @ApiProperty({type:'string', description:'El Endpoint donde sucedio el error.', example:'/api/example', nullable:false})
    path!:string

    @ApiProperty({type:'string', description:'La fecha y hora en la que sucedio el problema.', nullable:false})
    timestamp!:string;
}