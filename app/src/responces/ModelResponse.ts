import { ApiProperty } from "@nestjs/swagger";
export class ModelResponce {
    @ApiProperty({ example: null })
    data?: any;

    @ApiProperty({ example: 'Operación exitosa' })
    message!: string;

    @ApiProperty({ enum: ['success', 'error', 'warning'], example: 'success' })
    status!: 'success' | 'error' | 'warning';
}