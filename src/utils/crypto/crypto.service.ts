import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt')
const crypto = require('crypto')

@Injectable()
export class CryptoService {
    async hashPassword(password: string){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword
    }   

    async comparePassword(candidatePassword: string, storedPassword: string){
        const isMatch = await bcrypt.compare(candidatePassword, storedPassword);
        return isMatch;
    }

    hashString(str: string){
        return crypto.createHash('md5').update(str).digest('hex');
    }
}
