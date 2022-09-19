import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class SocioDto {

    // readonly codigo: string;
    
    @IsString()
    @IsNotEmpty()
    readonly nombreUsuario: string;

    @IsString()
    @IsNotEmpty()
    readonly correoElectronico: string;

    @IsString()
    @IsNotEmpty()
    readonly fechaNacimiento: Date;

}
