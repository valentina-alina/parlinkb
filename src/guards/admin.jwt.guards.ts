/* eslint-disable prettier/prettier */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtDecode } from 'jwt-decode';


interface MyJwtPayload {
    userId: string;
    role: string;
    iat: number;
    exp: number;
    // Ajoutez d'autres propriétés ici si nécessaire
}

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Access denied: Token not found');
        }

        let tokenDecode: MyJwtPayload;

        try {
            tokenDecode = jwtDecode<MyJwtPayload>(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        if (tokenDecode.role !== 'admin') {
            console.log('role=', tokenDecode.role, 'is not admin:', tokenDecode.role !== 'admin');
            throw new UnauthorizedException('Access denied: Admins only');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
