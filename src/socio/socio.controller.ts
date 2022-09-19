import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

@Controller('socios')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {

    constructor(
        private readonly socioService: SocioService
    ){}

    @Get()
    async findAll() {
        return await this.socioService.findAll();
    }

    @Get(':socioCodigo')
    async findOne(@Param('socioCodigo') socioCodigo: string) {
        return await this.socioService.findOne(socioCodigo);
    }

    @Post()
    async create(@Body() socioDto: SocioDto) {
        const socio = plainToInstance(SocioEntity, socioDto)
        return await this.socioService.create(socio);
    }
    
    @Put(':socioCodigo')
    async update(@Param('socioCodigo') socioCodigo: string, @Body() socioDto: SocioDto){
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.update(socioCodigo, socio);
    }

    @Delete(':socioCodigo')
    @HttpCode(204)
    async delete(@Param('socioCodigo') socioCodigo: string) {
        return await this.socioService.delete(socioCodigo);
    }

}
