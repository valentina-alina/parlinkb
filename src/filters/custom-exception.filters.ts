/* eslint-disable prettier/prettier */
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomException } from '../exceptions/custom.exception';

@Catch(CustomException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
    catch(exception: CustomException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response //? renvoie des erreurs dans Express
        .status(status)
        .json({
            statusCode: status,
            message: exception.message,
            code: exception.code,
            timestamp: new Date().toISOString(),
            path: request.url,
            body: request.body,
        });
    }
}