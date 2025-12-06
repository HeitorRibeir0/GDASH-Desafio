import { Controller, Get, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.pokemonService.findAll(limit, offset);
  }
}