
import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.services";
import { Roles, RolesList } from "src/decorators/role.decorator";
@Roles(RolesList.ADMIN)
@Controller("dashboard")
export class DashboardController{
    constructor(private readonly dashboardService:DashboardService){}
    @Get("info_ordenes")
    GetInforOrdenes(){
        return this.dashboardService.GetInfoOrdenes()
    }
    @Get("info_productos")
    GetInfoProductos(){
        return this.dashboardService.GetInfoProductos()
    }
    @Get("InfoUsuarios")
    GetUsuarios(){
        return this.dashboardService.InfoUsuarios()
    }
}