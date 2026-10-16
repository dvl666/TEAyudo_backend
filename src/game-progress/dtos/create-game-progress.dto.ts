import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateGameProgressDto {

    @IsUUID()
    @IsNotEmpty()
    infantId: string;

    @IsUUID()
    @IsNotEmpty()
    game: string;

    @IsUUID()
    @IsNotEmpty()
    categoryPlayedId: string;

    @IsNumber()
    @IsNotEmpty()
    correctAnswers: number;

    @IsNumber()
    @IsNotEmpty()
    totalAnswers: number;

}