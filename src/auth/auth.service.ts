/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {


  generateRandomPassword(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const bytes = randomBytes(length);
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset[bytes[i] % charset.length];
    }
    
    return password;
  }

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async compare(password: string, hashed_password: string): Promise<boolean> {
        return bcrypt.compare(password, hashed_password);
    }

}