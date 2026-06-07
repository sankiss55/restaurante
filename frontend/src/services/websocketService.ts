import { io, Socket } from 'socket.io-client';

interface OrdenActualizada {
  id: number;
  id_estado: number;
  id_mesa: { id: number };
  [key: string]: any;
}

class WebSocketService {
  private socket: Socket | null = null;
  private url: string;
  private conectado = false;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    // Usar la URL del API configurada en .env, o localhost como fallback
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    this.url = apiUrl.replace(/\/$/, ''); // Remover trailing slash
    console.log('[WS] 🔧 URL configurada:', this.url);
  }

  conectar(rol: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('[WS] 🔌 Iniciando conexión a', this.url, 'con rol:', rol);
        this.socket = io(this.url, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'], // Soportar ambos
        });

        this.socket.on('connect', () => {
          console.log('[WS] ✅ CONECTADO al servidor WebSocket. ID:', this.socket?.id);
          this.conectado = true;

          // Unirse a la sala correspondiente
          if (rol === 'cocinero') {
            console.log('[WS] 🏪 [ACTION] Emitiendo evento "join-kitchen" al servidor...');
            this.socket!.emit('join-kitchen', { rol: 'cocinero' }, (response: any) => {
              console.log('[WS] 🏪 [CALLBACK] Respuesta de join-kitchen:', response);
            });
          } else if (rol === 'mesero') {
            console.log('[WS] 🍽️ [ACTION] Emitiendo evento "join-waiter" al servidor...');
            this.socket!.emit('join-waiter', { rol: 'mesero' }, (response: any) => {
              console.log('[WS] 🍽️ [CALLBACK] Respuesta de join-waiter:', response);
            });
          }

          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('[WS] ❌ DESCONECTADO del servidor');
          this.conectado = false;
        });

        this.socket.on('kitchen-joined', (data) => {
          console.log('[WS] 🏪 [EVENTO] kitchen-joined recibido:', data);
          this.emitirEvento('kitchen-joined', data);
        });

        this.socket.on('waiter-joined', (data) => {
          console.log('[WS] 🍽️ [EVENTO] waiter-joined recibido:', data);
          this.emitirEvento('waiter-joined', data);
        });

        this.socket.on('ordenes-actualizar', (data) => {
          console.log('[WS] 📦 [EVENTO] ordenes-actualizar recibido:', data);
          console.log('[WS] 📦 [DEBUG] Tipo de data:', typeof data, 'Keys:', Object.keys(data || {}));
          this.emitirEvento('ordenes-actualizar', data);
        });

        this.socket.on('estado-cambiado', (data) => {
          console.log('[WS] 🔄 [EVENTO] estado-cambiado recibido:', data);
          this.emitirEvento('estado-cambiado', data);
        });

        this.socket.on('mesa-liberada', (data) => {
          console.log('[WS] 🔓 [EVENTO] mesa-liberada recibido:', data);
          this.emitirEvento('mesa-liberada', data);
        });

        this.socket.on('error', (error) => {
          console.error('[WS] ⚠️ [ERROR] Error en WebSocket:', error);
          this.emitirEvento('error', error);
        });

        this.socket.on('connect_error', (error) => {
          console.error('[WS] ⚠️ [CONNECT_ERROR] Error de conexión:', error);
          reject(error);
        });

        this.socket.on('message', (data) => {
          console.log('[WS] 💬 [MENSAJE] Mensaje genérico:', data);
        });

        // Escuchar todos los eventos
        this.socket.onAny((eventName, ...args) => {
          if (!['disconnect', 'connect'].includes(eventName)) {
            console.log('[WS] 🔍 [EVENTO-GENÉRICO]', eventName, '→', args);
          }
        });

      } catch (error) {
        console.error('[WS] ❌ [EXCEPTION] Error al crear socket:', error);
        reject(error);
      }
    });
  }

  desconectar(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.conectado = false;
    }
  }

  cambiarEstadoOrden(
    ordenId: number,
    nuevoEstado: number,
    rol: string
  ): void {
    if (!this.conectado || !this.socket) {
      console.error('[WS] No conectado al servidor');
      return;
    }

    this.socket.emit('orden-cambiar-estado', {
      id: ordenId,
      nuevoEstado: nuevoEstado,
      rol: rol,
    });
  }

  escucharActualizaciones(callback: (data: OrdenActualizada) => void): void {
    this.suscribirse('ordenes-actualizar', callback);
  }

  escucharEstadoCambiado(callback: (data: any) => void): void {
    this.suscribirse('estado-cambiado', callback);
  }

  escucharErrores(callback: (error: any) => void): void {
    this.suscribirse('error', callback);
  }

  escucharMesaLiberada(callback: (data: any) => void): void {
    this.suscribirse('mesa-liberada', callback);
  }

  private suscribirse(evento: string, callback: Function): void {
    if (!this.listeners.has(evento)) {
      this.listeners.set(evento, []);
    }
    this.listeners.get(evento)!.push(callback);
  }

  private emitirEvento(evento: string, data: any): void {
    const callbacks = this.listeners.get(evento);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  estaConectado(): boolean {
    return this.conectado;
  }
}

export default new WebSocketService();
