import { FilterConfiguration } from './../../../app/query/model/filter.model';
import { FilterPort } from './../../../app/ports';
import {
    GetFilterConfigurationContainerDTO,
    FilterConfigurationDTO
} from './../model/response.model';
import { FilterConfigController } from './../model/controller.model';
import { Response } from 'express';
import { AbstractController } from './abstract.controller';
import { controller, httpGet, response } from 'inversify-express-utils';
import { ROUTE } from '../model/enums';
import { inject } from 'inversify';
import { APPLICATION_TYPES } from '../../../app/application.types';

enum FILTER_CONFIG_ROUTE {
    ROOT = '/filterconfig'
}
@controller(ROUTE.VERSION + FILTER_CONFIG_ROUTE.ROOT)
export class DefaultFilterConfigController extends AbstractController
    implements FilterConfigController {
    constructor(
        @inject(APPLICATION_TYPES.FilterService)
        private filterService: FilterPort
    ) {
        super();
    }

    @httpGet('/')
    async getFilterConfiguration(@response() res: Response) {
        try {
            const filterConfigs = await this.filterService.getFilterConfiguration();

            const dto: GetFilterConfigurationContainerDTO = {
                filters: filterConfigs.map(config =>
                    this.filterConfigurationToDTO(config)
                )
            };
            this.ok(res, dto);
        } catch (error) {
            this.handleError(res);
        }
    }

    private handleError(res: Response) {
        this.fail(res, 'Unable to retrieve system information');
    }

    private filterConfigurationToDTO(
        configuration: FilterConfiguration
    ): FilterConfigurationDTO {
        return {
            id: configuration.id,
            values: configuration.values
        };
    }
}
