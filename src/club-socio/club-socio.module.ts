import { Module } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';

@Module({
  providers: [ClubSocioService]
})
export class ClubSocioModule {}
