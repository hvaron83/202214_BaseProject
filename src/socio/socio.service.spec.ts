/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

import { faker } from '@faker-js/faker';

describe('SocioService', () => {
 let service: SocioService;
 let repository: Repository<SocioEntity>;
 let sociosList: SocioEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [SocioService],
   }).compile();

   service = module.get<SocioService>(SocioService);
   repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
   await seedDatabase();
 });
 
 const seedDatabase = async () => {
  repository.clear();
  sociosList = [];
  for(let i = 0; i < 5; i++){
      const socio: SocioEntity = await repository.save({
      nombreUsuario: faker.name.firstName(), 
      correoElectronico: faker.internet.email(), 
      fechaNacimiento: faker.date.birthdate()})
      sociosList.push(socio);
  }
}
 
 it('Deberia estar definido', () => {
   expect(service).toBeDefined();
 });

 it('findAll deberia retornar todos los socios', async () => {
  const socios: SocioEntity[] = await service.findAll();
  expect(socios).not.toBeNull();
  expect(socios).toHaveLength(sociosList.length);
});

it('findOne deberia retornar un socio por id', async () => {
  const storedSocio: SocioEntity = sociosList[0];
  const socio: SocioEntity = await service.findOne(storedSocio.id);
  expect(socio).not.toBeNull();
  expect(socio.nombreUsuario).toEqual(storedSocio.nombreUsuario)
  expect(socio.correoElectronico).toEqual(storedSocio.correoElectronico)
  expect(socio.fechaNacimiento).toEqual(storedSocio.fechaNacimiento)
});

it('findOne deberia retornar una excepcion por un socio no valido ', async () => {
  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El socio con el id dado no fue encontrado")
});

it('create deberia retornar un nuevo socio', async () => {
  const socio: SocioEntity = {
    id: "",
    nombreUsuario: faker.name.firstName(), 
    correoElectronico: faker.internet.email(), 
    fechaNacimiento: faker.date.birthdate(),
    clubs: []
  }
  
  const newSocio: SocioEntity = await service.create(socio);
  expect(newSocio).not.toBeNull();

  const storedSocio: SocioEntity = await repository.findOne({where: {id: newSocio.id}})
  expect(storedSocio).not.toBeNull();
  expect(storedSocio.nombreUsuario).toEqual(newSocio.nombreUsuario)
  expect(storedSocio.correoElectronico).toEqual(newSocio.correoElectronico)
  expect(storedSocio.fechaNacimiento).toEqual(newSocio.fechaNacimiento)
});

it('create deberia retornar excepcion por socio no valido', async () => {
  const socio: SocioEntity = {
    id: "",
    nombreUsuario: faker.name.firstName(), 
    correoElectronico: faker.name.firstName(), 
    fechaNacimiento: faker.date.birthdate(),
    clubs: []
  }
  
  await expect(() => service.create(socio)).rejects.toHaveProperty("message", "El correo del socio no es valido")
});

it('update debería modificar un socio', async () => {
  const socio: SocioEntity = sociosList[0];
  socio.nombreUsuario = faker.name.firstName();
  socio.correoElectronico = faker.internet.email();
  socio.fechaNacimiento =  faker.date.birthdate();

  const updatedSocio: SocioEntity = await service.update(socio.id, socio);
  expect(updatedSocio).not.toBeNull();

  const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
  expect(storedSocio).not.toBeNull();
  expect(storedSocio.nombreUsuario).toEqual(socio.nombreUsuario)
  expect(storedSocio.correoElectronico).toEqual(socio.correoElectronico)
  expect(storedSocio.fechaNacimiento).toEqual(socio.fechaNacimiento)
});

it('update deberia retornar excepcion por socio no valido', async () => {
  const socio: SocioEntity = sociosList[0];
  socio.nombreUsuario = faker.name.firstName();
  socio.correoElectronico = faker.internet.email();
  socio.fechaNacimiento =  faker.date.birthdate();
  
  await expect(() => service.update("0",socio)).rejects.toHaveProperty("message", "El socio con el id dado no fue encontrado")
});

it('delete debería eliminar un socio', async () => {
  const socio: SocioEntity = sociosList[0];
  await service.delete(socio.id);

  const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
  expect(deletedSocio).toBeNull();
});

it('delete debería arrojar una excepción por socio no valido', async () => {
  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El socio con el id dado no fue encontrado")
});
});
