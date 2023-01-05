import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
export const getMongooseModuleOptions = (
  config: EnvironmentConfigService,
): MongooseModuleOptions => ({
  uri:
    process.env.NODE_ENV === 'local'
      ? `mongodb+srv://${config.getDatabaseUser()}:${config.getDatabasePassword()}@${config.getDatabaseHost()}/${config.getDatabaseName()}`
      : `mongodb+srv://${config.getDatabaseUser()}:${config.getDatabasePassword()}@${config.getDatabaseHost()}/${config.getDatabaseName()}`,
});
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getMongooseModuleOptions,
    }),
  ],
})
export class MongooseConfigModule {}
