import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before...');
    // return next.handle().pipe(tap((data) => console.log('After...', data)));
    return next.handle().pipe(
      map((data) => ({
        apiVersion: this.configService.get('API_VERSION'),
        data: data,
      })),
    );
  }
}
