import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PictogramService } from 'src/pictogram/pictogram.service';

@Injectable()
export class UserPropertyGuard implements CanActivate {

  constructor(
    private readonly reflector : Reflector,
    private readonly pictogramServide : PictogramService
  ) {}
  
  canActivate( context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {
    
    return true;
  }
}
