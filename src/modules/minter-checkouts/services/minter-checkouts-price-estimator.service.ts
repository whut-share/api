import { Injectable, OnModuleInit } from '@nestjs/common';
import { chain_networks_list } from '@/providers/chain-networks';
import { Sich } from '@/libs/sich';
import { MINTER_CONVERTATION_SLIPPAGE, MINTER_MIN_USD_MINTING_PRICE } from '@/constants';
import Axios from 'axios';
import { typeToContractName } from '@/helpers';
import { MinterCheckoutSessionPriceEstimate } from '@/schemas';


@Injectable()
export class MinterCheckoutsPriceEstimatorService {


  constructor(
    private sich: Sich
  ) {}


  async estimate(network_key: string, type: string): Promise<MinterCheckoutSessionPriceEstimate> {

    const contract_name = typeToContractName(type);

    const args = [
      '0x2020202020202020202020202020202020202020202020202020202020202020',
      '0xaa321420817C11860824a7cc5b30f6f18918EA15', 
      '0x2020202020202020202020202020202020202020202020202020202020202020', 
      1, 
      '0x'
    ];

    const { total_eth, gas, gas_price } = await this.sich.estimateJobGas(contract_name, 'mint', args, network_key);
    const network = chain_networks_list.find(n => n.id === network_key);
    
    let eth_price: number = 1;
    
    if(network.native_curr_symbol === 'GoETH') {
      eth_price = 100000;
    } else {
      const data = await Axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
        },
        params: {
          symbol: network.native_curr_symbol,
        }
      }).then(res => res.data.data['ETH'][0]);

      eth_price = data.quote['USD'].price;
    }

    // min price for minting will always be 1 USD
    const price = Math.max(MINTER_MIN_USD_MINTING_PRICE, eth_price * (total_eth * (1 + MINTER_CONVERTATION_SLIPPAGE)));

    return {
      price,
      total_eth,
      eth_price,
      gas_price,
      gas,
      slippage: MINTER_CONVERTATION_SLIPPAGE,
    };
  }
}