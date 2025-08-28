import * as dotenv from 'dotenv';
import * as soap from 'soap';
import { Injectable } from '@nestjs/common';
import { carBrands } from 'src/markiReady/markiReady';

dotenv.config();

@Injectable()
export class SoapService {
  private readonly WSDL_URL = process.env.BASE_URL;
  private readonly LOGIN = process.env.LOGIN;
  private readonly PASSWORD = process.env.PASSWORD;

  /**
   * Проверка переменных окружения и входных параметров.
   */
  private validateEnvAndParams(
    params: Record<string, string | string[] | number[]>,
  ) {
    if (!this.WSDL_URL) {
      throw new Error('Переменная окружения BASE_URL (WSDL_URL) не задана.');
    }

    if (!this.LOGIN || !this.PASSWORD) {
      throw new Error('Не заданы переменные окружения LOGIN или PASSWORD.');
    }

    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        if (!value.trim()) {
          throw new Error(`Не передан параметр: ${key}`);
        }
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          throw new Error(`Массив параметра ${key} пуст.`);
        }
        if (
          value.some(
            (item) =>
              item === null ||
              item === undefined ||
              (typeof item === 'string' && item.trim() === '') ||
              (typeof item === 'number' && isNaN(item)),
          )
        ) {
          throw new Error(`Массив ${key} содержит пустые значения.`);
        }
      } else {
        throw new Error(
          `Неверный тип параметра ${key}. Ожидается строка, массив строк или массив чисел.`,
        );
      }
    }
  }

  /**
   * Создание SOAP-клиента с проверкой наличия WSDL_URL.
   */
  private async createSoapClient() {
    if (!this.WSDL_URL) {
      throw new Error(
        'Ошибка: WSDL_URL не задан. SOAP-клиент не может быть создан.',
      );
    }
    return soap.createClientAsync(this.WSDL_URL);
  }

  /* Получаем марки автомобилей */
  getCarBrands(): string[] {
    this.validateEnvAndParams({});

    return carBrands;
  }

  /* Получаем модели автомобилей по маркам */
  async getModelAvto(marka: string): Promise<string[]> {
    this.validateEnvAndParams({ marka });

    const client = await this.createSoapClient();
    const [response] = await client.GetModelAvtoAsync({
      login: this.LOGIN,
      password: this.PASSWORD,
      marka,
    });

    return response?.GetModelAvtoResult?.model_list?.string ?? [];
  }

  /* Получаем годы выпуска автомобилей по маркам и моделям */
  async getYearAvto(marka: string, model: string) {
    this.validateEnvAndParams({ marka, model });

    const client = await this.createSoapClient();

    const [response] = await client.GetYearAvtoAsync({
      login: this.LOGIN,
      password: this.PASSWORD,
      marka,
      model,
    });
    return response?.GetYearAvtoResult?.yearAvto_list?.yearAvto ?? [];
  }

  /* Получаем модификации автомобилей по маркам, моделям и годам выпуска */
  async getModificationAvto(
    marka: string,
    model: string,
    year_beg: number[],
    year_end: number[],
  ) {
    this.validateEnvAndParams({ marka, model, year_beg, year_end });

    const client = await this.createSoapClient();
    const [response] = await client.GetModificationAvtoAsync({
      login: this.LOGIN,
      password: this.PASSWORD,
      marka,
      model,
      year_beg,
      year_end,
    });

    return response?.GetModificationAvtoResult?.modification_list?.string ?? [];
  }

  async getWarehouses() {
    this.validateEnvAndParams({});

    const client = await this.createSoapClient();
    const [response] = await client.GetWarehousesAsync({
      login: this.LOGIN,
      password: this.PASSWORD,
    });

    return response?.GetWarehousesResult?.warehouses?.WarehouseInfo ?? [];
  }

  /* Получаем склады по address_id */
  async getWarehousesByAddress(address_id: string) {
    this.validateEnvAndParams({ address_id });

    const client = await this.createSoapClient();
    const [response] = await client.GetWarehousesAsync({
      login: this.LOGIN,
      password: this.PASSWORD,
      address_id: address_id,
    });

    return response?.GetWarehousesResult?.warehouses ?? [];
  }

  /* Получаем шины */

  async getGoodsByCar(
    marka: string,
    model: string,
    modification: string,
    podbor_type: number[],
    season_list: string[],
    thom: boolean,
    type: string[],
    wh_list: number[],
    year_beg: number[],
    year_end: number[],
  ) {
    const client = await this.createSoapClient();
    const [response] = await client.GetGoodsByCarAsync({
      login: this.LOGIN,
      password: this.PASSWORD,
      filter: {
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
      },
    });
    
    return response?.GetGoodsByCarResult ?? [];
  }
}
