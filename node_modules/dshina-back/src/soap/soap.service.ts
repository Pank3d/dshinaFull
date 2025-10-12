import * as dotenv from 'dotenv';
import * as soap from 'soap';
import { Injectable } from '@nestjs/common';
import { carBrands } from 'src/markiReady/markiReady';
import { FindTyreFilter, ResultFindTyre } from 'src/types/soap';

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

  async findTyre(
    filter: FindTyreFilter,
  ): Promise<ResultFindTyre> {
    const client = await this.createSoapClient();

    try {
      const filteredResults: any[] = [];
      let apiPage = 0;
      let currencyRate: any;
      let warehouseLogistics: any;
      const apiPageSize = 50; // Размер страницы для запросов к API

      // Фетчим все страницы API до конца
      while (true) {
        const requestParams = {
          login: this.LOGIN,
          password: this.PASSWORD,
          filter: filter,
          page: apiPage,
          pageSize: apiPageSize,
        };

        const [response] = await client.GetFindTyreAsync(requestParams);

        currencyRate = response?.GetFindTyreResult?.currencyRate;
        warehouseLogistics = response?.GetFindTyreResult?.warehouseLogistics;

        let priceRestList = response?.GetFindTyreResult?.price_rest_list?.TyrePriceRest || [];

        // Если API вернул пустой список, значит страницы закончились
        if (!Array.isArray(priceRestList) || priceRestList.length === 0) {
          break;
        }

        // ФИЛЬТРАЦИЯ НА СТОРОНЕ БЭКЕНДА по высоте, диаметру, индексу скорости и минимальному количеству
        // API корректно фильтрует по ширине, поэтому фильтруем только оставшиеся параметры
        const filtered = priceRestList.filter((tyre: any) => {
          const name = tyre.name || '';
          // Парсим размер из строки типа "195/65R15" или "255/40ZR19"
          const sizeMatch = name.match(/(\d+)\/(\d+)[A-Z]*R(\d+)/);

          if (!sizeMatch) {
            return false;
          }

          const [, , height, diameter] = sizeMatch.map(Number);

          // Фильтруем по высоте и диаметру (ширину API обрабатывает корректно)
          if (filter.height_min !== undefined && height < filter.height_min) return false;
          if (filter.height_max !== undefined && height > filter.height_max) return false;
          if (filter.diameter_min !== undefined && diameter < filter.diameter_min) return false;
          if (filter.diameter_max !== undefined && diameter > filter.diameter_max) return false;

          // Фильтруем по индексу скорости (если указан)
          if (filter.speed_index) {
            // Извлекаем индекс скорости из названия (например, "195/65R15 91H" -> "H")
            const speedMatch = name.match(/\d+[A-Z]*R\d+[C]?\s*\d+[A-Z]*\s*([A-Z]+)/);
            if (speedMatch) {
              const speedIndex = speedMatch[1];
              // Проверяем, содержит ли индекс скорости нужную букву
              if (!speedIndex.includes(filter.speed_index)) {
                return false;
              }
            } else {
              // Если не смогли извлечь индекс скорости - отфильтровываем
              return false;
            }
          }

          // Фильтруем по минимальному количеству в наличии
          if (filter.min_stock !== undefined) {
            const whPriceRest = tyre.whpr?.wh_price_rest || [];
            // Суммируем остатки по всем складам
            const totalStock = whPriceRest.reduce((sum: number, item: any) => sum + (item.rest || 0), 0);
            if (totalStock < filter.min_stock) {
              return false;
            }
          }

          return true;
        });

        filteredResults.push(...filtered);
        apiPage++;

        // Если API вернул меньше результатов чем запрашивали, значит это последняя страница
        if (priceRestList.length < apiPageSize) {
          break;
        }
      }

      // Возвращаем ВСЕ отфильтрованные результаты без пагинации
      return {
        currencyRate: currencyRate,
        price_rest_list: {
          TyrePriceRest: filteredResults
        },
        totalPages: 1,
        warehouseLogistics: warehouseLogistics,
        error: undefined,
      };
    } catch (error) {
      console.error('Ошибка при поиске шин:', error.message);

      return {
        error: `Ошибка при поиске шин: ${error.message}`,
        price_rest_list: [],
        totalPages: 0,
      };
    }
  }
}
  