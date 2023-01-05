import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { KakaoAuthService } from './kakao-auth.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  providers: [
    {
      inject: [HttpService],
      provide: KakaoAuthService,
      useFactory: (httpService: HttpService) =>
        new KakaoAuthService(httpService),
    },
  ],
  exports: [KakaoAuthService],
})
export class KakaoModule {}
