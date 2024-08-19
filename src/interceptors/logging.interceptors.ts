/* eslint-disable prettier/prettier */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Response<T> {
    data: T;
}

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        console.log('Avant...');

        const now = Date.now();
        return next
        .handle()
        .pipe(
            tap(() => console.log(`Après... ${Date.now() - now}ms`)),
        );
    }
}