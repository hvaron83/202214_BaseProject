/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

import { faker } from '@faker-js/faker';

describe('ClubService', () => {
 let service: ClubService;
 let repository: Repository<ClubEntity>;
 let clubsList: ClubEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [ClubService],
   }).compile();

   service = module.get<ClubService>(ClubService);
   repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
   await seedDatabase();
 });
 
 const seedDatabase = async () => {
  repository.clear();
  clubsList = [];
  for(let i = 0; i < 5; i++){
      const club: ClubEntity = await repository.save({
        nombre: faker.name.firstName(),
        fechaFundacion: faker.date.birthdate(), 
        imagen: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence()
      })

      
      clubsList.push(club);
  }
}
 
 it('Deberia estar definido', () => {
   expect(service).toBeDefined();
 });

 it('findAll deberia retornar todos los socios', async () => {
  const socios: ClubEntity[] = await service.findAll();
  expect(socios).not.toBeNull();
  expect(socios).toHaveLength(clubsList.length);
});

it('findOne deberia retornar un socio por id', async () => {
  const storedSocio: ClubEntity = clubsList[0];
  const socio: ClubEntity = await service.findOne(storedSocio.id);
  expect(socio).not.toBeNull();
  expect(socio.nombre).toEqual(storedSocio.nombre)
  // expect(socio.correoElectronico).toEqual(storedSocio.correoElectronico)
  // expect(socio.fechaNacimiento).toEqual(storedSocio.fechaNacimiento)
});

it('findOne deberia retornar una excepcion por un socio no valido ', async () => {
  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El club con el id dado no fue encontrado")
});

it('create deberia retornar un nuevo club', async () => {
  let club: ClubEntity = {
    id: "",
    nombre: faker.name.firstName(),
          fechaFundacion: faker.date.birthdate(), 
          imagen: faker.lorem.sentence(),
          descripcion: faker.lorem.sentence(),
          socios: []
  }
  
  const newSocio: ClubEntity = await service.create(club);
  expect(newSocio).not.toBeNull();

  const storedSocio: ClubEntity = await repository.findOne({where: {id: newSocio.id}})
  expect(storedSocio).not.toBeNull();
  expect(storedSocio.nombre).toEqual(newSocio.nombre)
  // expect(storedSocio.correoElectronico).toEqual(newSocio.correoElectronico)
  // expect(storedSocio.fechaNacimiento).toEqual(newSocio.fechaNacimiento)
});

it('create deberia retornar excepcion por socio no valido', async () => {
  const socio: ClubEntity = {
    id:"",
    nombre: faker.name.firstName(),
          fechaFundacion: faker.date.birthdate(), 
          imagen: faker.lorem.sentence(),
          descripcion: faker.lorem.words(101),
          socios: []
  }
  
  await expect(() => service.create(socio)).rejects.toHaveProperty("message", "La descripcion del club no es valida")
});

it('update debería modificar un socio', async () => {
  const socio: ClubEntity = clubsList[0];
  socio.nombre = faker.name.firstName();
  // socio.correoElectronico = faker.internet.email();
  // socio.fechaNacimiento =  faker.date.birthdate();

  const updatedSocio: ClubEntity = await service.update(socio.id, socio);
  expect(updatedSocio).not.toBeNull();

  const storedSocio: ClubEntity = await repository.findOne({ where: { id: socio.id } })
  expect(storedSocio).not.toBeNull();
  expect(storedSocio.nombre).toEqual(socio.nombre)
  // expect(storedSocio.correoElectronico).toEqual(socio.correoElectronico)
  // expect(storedSocio.fechaNacimiento).toEqual(socio.fechaNacimiento)
});

it('update deberia retornar excepcion por socio no valido', async () => {
  const socio: ClubEntity = clubsList[0];
  socio.nombre = faker.name.firstName();
  // socio.correoElectronico = faker.internet.email();
  // socio.fechaNacimiento =  faker.date.birthdate();
  
  await expect(() => service.update("0",socio)).rejects.toHaveProperty("message", "El club con el id dado no fue encontrado")
});

it('delete debería eliminar un socio', async () => {
  const socio: ClubEntity = clubsList[0];
  await service.delete(socio.id);

  const deletedSocio: ClubEntity = await repository.findOne({ where: { id: socio.id } })
  expect(deletedSocio).toBeNull();
});

it('delete debería arrojar una excepción por socio no valido', async () => {
  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El club con el id dado no fue encontrado")
});
});
