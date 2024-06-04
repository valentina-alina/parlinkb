/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Post,
    Req, 
    Res,
    Logger
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request, Response } from 'express';


//TODO: CREATE USER + CREATE PROFILE --> SIGNUP | REGISTER
//TODO: DELETE USER + DELETE PROFILE --> DELETE | REMOVE
//TODO: READ USER BY ID
//TODO: READ ALL USERS

//TODO: CREATE CHILD
//TODO: READ ALL CHILDREN
//TODO: READ CHILD BY PARAMS [FINDBYPARAMS]
//TODO: READ CHILD BY ID [FINDBYID]
//TODO: UPDATE CHILDREN
//TODO: DELETE CHILDREN

//TODO: CREATE CATEGORY | SUBCATEGORY
//TODO: READ ALL CATEGORIES | SUBCATEGORIES
//TODO: READ CATEGORY | SUBCATEGORY BY PARAMS [FINDBYPARAMS]  -->  UPDATE | DELETE [FINDBYPARAMS]
//TODO: READ CATEGORY | SUBCATEGORY BY ID [FINDBYID] -->  UPDATE | DELETE [FINDBYID]
//TODO: UPDATE CATEGORIES | SUBCATEGORIES
//TODO: DELETE CATEGORIES | SUBCATEGORIES

//TODO: //FIXME: CREATE SUBJECTS ??
//TODO: //FIXME: READ ALL SUBJECTS ??
//TODO: //FIXME: READ SUBJECT BY PARAMS [FINDBYPARAMS] ??
//TODO: //FIXME: READ SUBJECT BY ID [FINDBYID] ??
//TODO: //FIXME: UPDATE SUBJECTS ??
//TODO: //FIXME: DELETE SUBJECTS ??

@Controller('auth')
export class AuthController {

    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Req() request:Request,
        @Res() response: Response,
        @Body() loginDto: LoginUserDto
    ): Promise<any> {
        try {
            const result= await this.authService.login(loginDto);
            return response.status(200).json({
                status: 'Ok!',
                message: 'Connexion établie',
                result: result
            })
        } catch (error) {
            this.logger.error(`Error during login: ${error.message}`);
            return response.status(500).json({
                status: 'Erreur!',
                message: 'Connexion refusée'
            });
        }
    }
}