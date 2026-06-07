import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OrdenServices } from 'src/controllers/orden/orden.service';
import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';

interface ClientData {
  id: string;
  rol: 'cocina' | 'mesero';
}

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'https://didactic-train-g4xvqw64p4vxc9gj7-5173.app.github.dev',
      /\.app\.github\.dev$/  // Aceptar cualquier URL de Codespaces
    ],
    credentials: true,
  },
})
@Injectable()
export class OrdenesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private cocinaClients = new Map<string, Socket>();
  private meseroClients = new Map<string, Socket>();
  private clientData = new Map<string, ClientData>();

  constructor(
    @Inject(forwardRef(() => OrdenServices))
    private readonly ordenesService: OrdenServices
  ) {}

  handleConnection(client: Socket) {
  //   console.log(`[WS-GATEWAY] CLIENTE CONECTADO: ${client.id}`);
  //   console.log(`[WS-GATEWAY] 📊 Clientes activos - Cocina: ${this.cocinaClients.size}, Mesero: ${this.meseroClients.size}`);
   }

  handleDisconnect(client: Socket) {
    const clientInfo = this.clientData.get(client.id);
   
    this.cocinaClients.delete(client.id);
    this.meseroClients.delete(client.id);
    this.clientData.delete(client.id);
    
  }

  @SubscribeMessage('join-kitchen')
  handleJoinKitchen(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { rol: string }
  ): void {
    
    if (data.rol !== 'cocinero') {
      const error = 'Solo cocineros pueden unirse a la cocina';
      console.error(`[WS-GATEWAY] ❌ [join-kitchen] ${error} (rol recibido: ${data.rol})`);
      throw new UnauthorizedException(error);
    }

    this.cocinaClients.set(client.id, client);
    this.clientData.set(client.id, {
      id: client.id,
      rol: 'cocina',
    });

    client.emit('kitchen-joined', { message: 'Te has unido a la cocina' });
  }

  @SubscribeMessage('join-waiter')
  handleJoinWaiter(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { rol: string }
  ): void {
    
    if (data.rol !== 'mesero') {
      const error = 'Solo meseros pueden unirse a meseros';
      console.error(`[WS-GATEWAY] ❌ [join-waiter] ${error} (rol recibido: ${data.rol})`);
      throw new UnauthorizedException(error);
    }

    this.meseroClients.set(client.id, client);
    this.clientData.set(client.id, {
      id: client.id,
      rol: 'mesero',
    });

    client.emit('waiter-joined', { message: 'Te has unido a meseros' });
  }

  @SubscribeMessage('orden-cambiar-estado')
  async handleChangeOrderState(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: number; nuevoEstado: number; rol: string }
  ): Promise<void> {
    try {
      const clientInfo = this.clientData.get(client.id);

      if (!clientInfo) {
        client.emit('error', { message: 'No estás registrado en una sala' });
        return;
      }

      const resultado = await this.ordenesService.CambiarEstadoOrden(
        data.id,
        data.nuevoEstado,
        data.rol
      );

      if (resultado.status === 'success') {
        const orden = resultado.data;

        this.broadcastOrdenActualizada(orden);

        client.emit('estado-cambiado', {
          message: 'Estado actualizado exitosamente',
          orden,
        });
      }
    } catch (error:any) {
      console.error(`[WS] Error al cambiar estado:`, error.message);
      client.emit('error', {
        message: error.message || 'Error al cambiar estado',
      });
    }
  }

  private broadcastOrdenActualizada(orden: any): void {
    const mensaje = {
      type: 'ordenes-actualizar',
      data: orden,
    };
    if (this.cocinaClients.size > 0) {
      this.cocinaClients.forEach((client) => {
        client.emit('ordenes-actualizar', mensaje);
      });
    } else {
      console.warn(`[WS-GATEWAY] No hay cocineros conectados para recibir la orden`);
    }

    if (this.meseroClients.size > 0) {
      this.meseroClients.forEach((client) => {
        client.emit('ordenes-actualizar', mensaje);
      });
    } else {
      console.warn(`[WS-GATEWAY] ⚠️ No hay meseros conectados para recibir la orden`);
    }
  }

  emitirActualizacionOrden(orden: any): void {
    this.broadcastOrdenActualizada(orden);
  }

  emitirMesaLiberada(mesaId: number): void {
    const evento = {
      type: 'mesa-liberada',
      data: {
        mesaId,
        timestamp: new Date().toISOString()
      }
    };
    if(this.meseroClients.size > 0){
      this.meseroClients.forEach((client) => {
        client.emit('mesa-liberada', evento);
      });
    } else {
      console.warn(`[WS-GATEWAY] ⚠️ No hay meseros conectados`);
    }
  }
}
