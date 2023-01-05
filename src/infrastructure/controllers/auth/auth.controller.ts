import { UserModel } from '@domain/model/database/user';
import {
  AuthJwt,
  AuthRefreshJwt,
} from '@infrastructure/common/decorators/auth.decorator';
import { User } from '@infrastructure/common/decorators/user.decorator';
import { ApiResponseType } from '@infrastructure/common/decorators/response.decorator';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@infrastructure/usercases-proxy/usecases-proxy';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ClientSession, Connection, Types } from 'mongoose';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { LogoutUseCases } from '@usecases/auth/logout.usecases';
import { OAuthLoginDto, RefreshTokenDto } from './auth.dto';
import { AuthUserPresenter, TokenPresenter } from './auth.presenter';
import { IException } from '@domain/exceptions/exceptions.interface';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { GoogleOAuthUseCases } from '@usecases/auth/google-oauth.usecases';
import { AppleOAuthUseCases } from '@usecases/auth/apple-oauth.usecases';
import { KakaoOAuthUseCases } from '@usecases/auth/kakao-oauth.usecases';
import { CreateUserUseCases } from '@usecases/user/create.user.usecases';
import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';

@Controller('auth')
@ApiTags('Auth')
@ApiInternalServerErrorResponse({
  description: '확인되지 않은 서버에러, error_code: -6',
})
@ApiExtraModels(TokenPresenter, AuthUserPresenter)
export class AuthController {
  constructor(
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCasesProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UseCasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUseCasesProxy: UseCaseProxy<LogoutUseCases>,
    @Inject(UseCasesProxyModule.GOOGLE_OAUTH_USECASES_PROXY)
    private readonly googleOAuthUseCasesProxy: UseCaseProxy<GoogleOAuthUseCases>,
    @Inject(UseCasesProxyModule.APPLE_OAUTH_USECASES_PROXY)
    private readonly appleOAuthUseCasesProxy: UseCaseProxy<AppleOAuthUseCases>,
    @Inject(UseCasesProxyModule.KAKAO_OAUTH_USECASES_PROXY)
    private readonly kakaoOAuthUseCasesProxy: UseCaseProxy<KakaoOAuthUseCases>,
    @Inject(UseCasesProxyModule.CREATE_USER_USECASES_PROXY)
    private readonly createUserUseCasesProxy: UseCaseProxy<CreateUserUseCases>,
    @InjectConnection() private connection: Connection,
    @Inject(ExceptionsService)
    private readonly exceptionService: IException,
  ) {}

  @Get('swagger')
  @ApiOperation({ summary: '스웨거용 로그인' })
  @ApiResponseType(AuthUserPresenter)
  async swaggerLogin(
    @Query('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ObjectUserId = new Types.ObjectId(userId);
    const usecase = this.loginUseCasesProxy.getInstance();
    const user = await usecase.validateUserForJWTStrategy(ObjectUserId);

    if (!user) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_description: '해당하는 아이디의 유저 정보가 없습니다.',
      });
    }
    const retAccess = usecase.getJwtTokenAndCookie(user._id);
    const retRefresh = await usecase.getJwtRefreshTokenAndCookie(
      new Types.ObjectId(user._id),
    );

    res.setHeader('Set-Cookie', [retAccess.cookie, retRefresh.cookie]);
    return new AuthUserPresenter(retAccess.token, retRefresh.token, user);
  }

  @Post('apple')
  @ApiOperation({ summary: 'Apple OAuth2 로그인' })
  @ApiResponseType(AuthUserPresenter)
  async appleLogin(
    @Body() body: OAuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const appleOAuthUseCase = this.appleOAuthUseCasesProxy.getInstance();
    const payload = await appleOAuthUseCase.authApple(body.credential);

    const createUserUseCase = this.createUserUseCasesProxy.getInstance();
    let user = await createUserUseCase.checkMachedOAuthUser(
      payload.id,
      payload.auth_type,
    );
    const session: ClientSession = await this.connection.startSession();
    try {
      session.startTransaction();

      if (!user) {
        user = await createUserUseCase.createUser(
          payload,
          body.device_info.device_token,
          body.device_info.platform,
        );
      }

      const loginUseCase = this.loginUseCasesProxy.getInstance();
      await loginUseCase.updateDeviceInfo(
        user._id,
        body.device_info.device_token,
        body.device_info.platform,
        session,
      );
      const retAccess = loginUseCase.getJwtTokenAndCookie(user._id);
      const retRefresh = await loginUseCase.getJwtRefreshTokenAndCookie(
        user._id,
      );

      await session.commitTransaction();
      res.setHeader('Set-Cookie', [retAccess.cookie, retRefresh.cookie]);

      return new AuthUserPresenter(retAccess.token, retRefresh.token, user);
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '유저가 있으면 로그인 없으면 회원가입',
  })
  @ApiResponseType(AuthUserPresenter)
  async googleLogin(
    @Body() body: OAuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const googleOAuthUseCase = this.googleOAuthUseCasesProxy.getInstance();
    const tokenInfo = await googleOAuthUseCase.authToken(body.credential);
    if (!tokenInfo.sub || !tokenInfo.email) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_description: '유효한 토큰이 아닙니다.',
      });
    }
    const createUserUseCase = this.createUserUseCasesProxy.getInstance();
    let user = await createUserUseCase.checkMachedOAuthUser(
      tokenInfo.sub,
      AuthTypeEnum.google,
    );
    const session: ClientSession = await this.connection.startSession();
    try {
      session.startTransaction();

      if (!user) {
        const payload = await googleOAuthUseCase.getUserInfo(
          body.credential,
          tokenInfo.sub,
          tokenInfo.email,
        );
        user = await createUserUseCase.createUser(
          payload,
          body.device_info.device_token,
          body.device_info.platform,
          session,
        );
      }
      const loginUseCase = this.loginUseCasesProxy.getInstance();
      await loginUseCase.updateDeviceInfo(
        user._id,
        body.device_info.device_token,
        body.device_info.platform,
        session,
      );
      const retAccess = loginUseCase.getJwtTokenAndCookie(user._id);

      const retRefresh = await loginUseCase.getJwtRefreshTokenAndCookie(
        user._id,
      );
      await session.commitTransaction();
      res.setHeader('Set-Cookie', [retAccess.cookie, retRefresh.cookie]);

      return new AuthUserPresenter(retAccess.token, retRefresh.token, user);
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  @Post('kakao')
  @ApiOperation({ summary: 'Kakao OAuth2 로그인' })
  @ApiResponseType(AuthUserPresenter)
  async kakaoLogin(
    @Body() body: OAuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const kakaoOAuthUseCase = this.kakaoOAuthUseCasesProxy.getInstance();
    const tokenInfo = await kakaoOAuthUseCase.authToken(body.credential);
    const createUserUseCase = this.createUserUseCasesProxy.getInstance();
    let user = await createUserUseCase.checkMachedOAuthUser(
      tokenInfo.id.toString(),
      AuthTypeEnum.kakao,
    );
    const session: ClientSession = await this.connection.startSession();
    try {
      session.startTransaction();
      if (!user) {
        const payload = await kakaoOAuthUseCase.getUserInfo(body.credential);
        user = await createUserUseCase.createUser(
          payload,
          body.device_info.device_token,
          body.device_info.platform,
          session,
        );
      }

      const loginUseCase = this.loginUseCasesProxy.getInstance();
      await loginUseCase.updateDeviceInfo(
        user._id,
        body.device_info.device_token,
        body.device_info.platform,
        session,
      );
      const retAccess = loginUseCase.getJwtTokenAndCookie(user._id);
      const retRefresh = await loginUseCase.getJwtRefreshTokenAndCookie(
        user._id,
      );
      await session.commitTransaction();
      res.setHeader('Set-Cookie', [retAccess.cookie, retRefresh.cookie]);

      return new AuthUserPresenter(retAccess.token, retRefresh.token, user);
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  @Post('refresh')
  @AuthRefreshJwt()
  @ApiResponseType(TokenPresenter)
  @ApiOperation({ summary: '토큰 재발급 (토큰 - web: cookie, app: body)' })
  async refresh(
    @User() user: UserModel,
    @Res({ passthrough: true }) res: Response,
    @Body() data: RefreshTokenDto,
  ) {
    const useCase = this.loginUseCasesProxy.getInstance();
    await useCase.updateDeviceInfo(
      user._id,
      data.device_info.device_token,
      data.device_info.platform,
    );
    const retAccess = useCase.getJwtTokenAndCookie(user._id);
    const retRefresh = await useCase.getJwtRefreshTokenAndCookie(user._id);

    res.setHeader('Set-Cookie', [retAccess.cookie, retRefresh.cookie]);
    return new TokenPresenter(retAccess.token, retRefresh.token);
  }

  @Post('logout')
  @AuthJwt()
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponseType()
  async logout(
    @User() user: UserModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookie = await this.logoutUseCasesProxy
      .getInstance()
      .execute(user._id);

    res.setHeader('Set-Cookie', cookie);

    return 'Success';
  }
}
