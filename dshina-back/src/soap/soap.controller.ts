import { Controller, Get, Post, Body } from '@nestjs/common';
import { SoapService } from './soap.service';

@Controller('api/')
export class SoapController {
  constructor(private readonly soapService: SoapService) {}

  @Get('markiAvto')
  async getCarBrands() {
    return this.soapService.getCarBrands();
  }

  @Get('warehouses')
  async getWarehouses() {
    return this.soapService.getWarehouses();
  }

  @Post('modelsAvto')
  async getModelAvto(@Body('marka') marka: string) {
    return this.soapService.getModelAvto(marka);
  }

  @Post('yearAvto')
  async getYearAvto(
    @Body('marka') marka: string,
    @Body('model') model: string,
  ) {
    return this.soapService.getYearAvto(marka, model);
  }

  @Post('modificationsAvto')
  async getModificationAvto(
    @Body('marka') marka: string,
    @Body('model') model: string,
    @Body('year_beg') year_beg: number[],
    @Body('year_end') year_end: number[],
  ) {
    return this.soapService.getModificationAvto(
      marka,
      model,
      year_beg,
      year_end,
    );
  }

  @Post('goodsAvto')
  async getGoodsByCar(
    @Body('marka') marka: string,
    @Body('model') model: string,
    @Body('modification') modification: string,
    @Body('podbor_type') podbor_type: number[],
    @Body('season_list') season_list: string[],
    @Body('thom') thom: boolean,
    @Body('type') type: string[],
    @Body('wh_list') wh_list: number[],
    @Body('year_beg') year_beg: number[],
    @Body('year_end') year_end: number[],
  ) {
    return this.soapService.getGoodsByCar(
      marka,
      model,
      modification,
      podbor_type,
      season_list,
      thom,
      type,
      wh_list,
      year_beg,
      year_end,
    );
  }
}
