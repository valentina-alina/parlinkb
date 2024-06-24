/* eslint-disable prettier/prettier */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
    message: string;
    date: Date;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(
                (data: T & {message: string}) => {
                    const { message, ...rest } = data;
                    return { data: rest, message, date: new Date() };
                }
            )
        );
    }
}