const core = require('@actions/core');

const token = core.getInput('token');
const teams = core.getInput('teams'); //teams id

core.info('test ok');