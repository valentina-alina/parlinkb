/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomException extends HttpException {
    code: string;
    constructor(message: string, status: HttpStatus, code: string) {
        super(message, status);
        this.code = code;
    }
}