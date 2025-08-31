import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoapModule } from './soap/soap.module';
import { SoapController } from './soap/soap.controller';

@Module({
  imports: [SoapModule],
  controllers: [AppController, SoapController],
  providers: [AppService],
})
export class AppModule {}
