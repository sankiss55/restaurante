import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[JwtModule.register({
        signOptions:{expiresIn:'1h',algorithm:'HS256', issuer:process.env.JWT_ISSUER},
        secret:process.env.JWT_SECRET,
        global:true,
    })]
})
export class JWT_CONFIG{}