/* eslint no-mixed-operators:0 */
import React, { Component } from 'react';
import * as fractal from 'fractal-web3';

import TransactionList from '../../../../TransactionList';


export default class TransactionsTable extends Component {
  static displayName = 'TransactionsTable';

  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      current: 1,
      assetInfos: {},
      txFrom: {},
    };
  }

  componentDidMount() {
  	this.updateTxInfo();
  }

  updateTxInfo = () => {
    fractal.ft.getCurrentBlock().then(async (block) => {
      var curHeight = block.number;
      var maxLookbackNum = 1000;
      var maxTxNum = 20;
      var txNum = 0;
      
      let txHashArr = [];
      for (var height = curHeight; height > curHeight - maxLookbackNum && height > 0; height--) {
        if (txNum >= maxTxNum) {
          break;
        }
        const blockInfo = await fractal.ft.getBlockByNum(height, false);
        if (blockInfo == null || blockInfo.transactions == null) {
          continue;
        }
        for (let txHash of blockInfo.transactions) {
          txHashArr.push(txHash);
          txNum++;
          if (txNum >= maxTxNum) {
            break;
          }
        }
      }
      this.setState({txFrom: { txHashArr }});
      setTimeout(() => { this.updateTxInfo(); }, 3000);
    });
  }


  render() {
    return (
      <div className="progress-table">
        <TransactionList txFrom={this.state.txFrom}/>
      </div>
    );
  }
}