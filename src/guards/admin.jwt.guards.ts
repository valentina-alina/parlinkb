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
import { jwtPayloadDto } from './jwtPayload.dto';


@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Accès refusé: Token non trouvé');
        }

        let tokenDecode: jwtPayloadDto;

        try {
            tokenDecode = jwtDecode<jwtPayloadDto>(token);
        } catch (error) {
            throw new UnauthorizedException('Token invalide');
        }

        if (tokenDecode.role !== 'admin') {
            
            throw new UnauthorizedException('Accès refusé: Admin');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException('Token invalide');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}