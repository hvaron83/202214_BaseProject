import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from './socio/socio.entity';
import { ClubEntity } from './club/club.entity';
import { ClubSocioModule } from './club-socio/club-socio.module';
import { SocioController } from './socio/socio.controller';

@Module({
  imports: [SocioModule, ClubModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [SocioEntity, ClubEntity],
      synchronize: true,
      keepConnectionAlive: true
    }),
    ClubSocioModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
