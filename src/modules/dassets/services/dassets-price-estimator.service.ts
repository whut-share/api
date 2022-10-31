import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { DassetFlowSession, DassetFlowSessionDocument, ScanTarget, User, UserDocument } from '@/schemas';
import { SyncerService } from '@/modules/syncer/services/syncer.service';
import { networks_list } from '@/providers/networks/networks-list';
import * as FS from 'fs'
import * as Ethers from 'ethers';
import { assemblyContractRoute, getContractsPath, getInternalContractData, typeToContractName } from '@/helpers';
import { IDassetsSessionCreate } from '../interfaces/dassets-session-create.interface';
import Stripe from 'stripe';
import { Sich } from '@/providers/sich';
import { DASSETS_CONVERTATION_SLIPPAGE } from '@/constants';
import Axios from 'axios';
import { IDassetsPriceEstimate } from '../interfaces/dassets-price-estimate.interface';


@Injectable()
export class DassetsPriceEstimatorService {


  constructor(
    private sich: Sich
  ) {}


  async estimate(network_key: string, type: string): Promise<IDassetsPriceEstimate> {

    const contract_name = typeToContractName(type);

    const args = [
      '0x0000000000000000000000000000000000000000', 
      '0x', 
      1, 
      '0x'
    ];

    const { total_eth, gas, gas_price } = await this.sich.estimateJobGas(contract_name, 'mint', args, network_key);
    const network = networks_list.find(n => n.key === network_key);

    const data = await Axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
      },
      params: {
        symbol: network.native_curr_symbol,
      }
    }).then(res => res.data.data[0]);

    const eth_price = data.quote['USD'].price;

    const price = eth_price * (total_eth * (1 + DASSETS_CONVERTATION_SLIPPAGE));

    return {
      price,
      total_eth,
      eth_price,
      gas_price,
      gas,
      slippage: DASSETS_CONVERTATION_SLIPPAGE,
    };
  }
}