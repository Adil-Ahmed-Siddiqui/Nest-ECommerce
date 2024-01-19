import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
  } from '@nestjs/common';
  import { UsersService } from '../users.service';
  
  @Injectable()
  export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}
  
    async intercept(context: ExecutionContext, handler: CallHandler) {
      const request = context.switchToHttp().getRequest();
      const { id, name } = request.session.user || {};

      if (id) {
        const user = await this.usersService.getSingleUser(id);
        request.currentUser = user;
      }
  
      return handler.handle();
    }
  }
  