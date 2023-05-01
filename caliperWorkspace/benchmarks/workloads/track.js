'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
  constructor() {
    super();
    this.contractId = "";
    this.contractVersion = "";
  }
  /**
   * Initialize the workload module with the given parameters.
   * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
   * @param {number} totalWorkers The total number of workers participating in the round.
   * @param {number} roundIndex The 0-based index of the currently executing round.
   * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
   * @param {ConnectorBase} sutAdapter The adapter of the underlying SUT.
   * @param {Object} sutContext The custom context object provided by the SUT adapter.
   */
  async initializeWorkloadModule(
    workerIndex,
    totalWorkers,
    roundIndex,
    roundArguments,
    sutAdapter,
    sutContext
  ) {
    await super.initializeWorkloadModule(
      workerIndex,
      totalWorkers,
      roundIndex,
      roundArguments,
      sutAdapter,
      sutContext
    );

    const args = this.roundArguments;
    this.contractId = args.contractId;
    this.contractVersion = args.contractVersion;
  }

  /***** Override method *******/
  async submitTransaction() {
    let id = "asset";
    let position = (Math.random()*100).toString().concat(", ", (Math.random()*100).toString());
    let temperature = Math.floor(Math.random()*100);

    let txArgs = {
      contract: this.contractId,
      verb: "track",
      args: [
        id,
        temperature,
        position
      ],
      readOnly: false,
    };

    return this.sutAdapter.sendRequests(txArgs);
  }
}

function createWorkloadModule() {
  return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
