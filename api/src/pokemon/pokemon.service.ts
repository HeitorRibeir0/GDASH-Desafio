import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class PokemonService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(limit: number = 20, offset: number = 0) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    
    const response = await firstValueFrom(this.httpService.get(url));
    
    return response.data;
  }
}