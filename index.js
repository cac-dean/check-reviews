const core = require('@actions/core');

//const token = core.getInput('token');

const token = "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";
const teams = core.getInput('teams'); //teams id
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const parsePullRequestId = githubRef => {
  const result = /refs\/pull\/(\d+)\/merge/g.exec(githubRef);
  if (!result) throw new Error("Reference not found.");
  const [, pullRequestId] = result;
  return pullRequestId;
};

async function request(url, reqConfig){
  const res = await fetch(url, reqConfig);
  const data = await res.json();//assuming data is json
  return data;
}

async function getMustMember(pullRequestId){
  let url = 'https://api.github.com/repos/104corp/104cac-test-pr/pulls/' + pullRequestId + '/reviews'
  let reqConfig = {
    "method" : 'get',
    "headers" : {
      "Authorization" : "Bearer " + jwt
    }
  }
}

const pullRequestId = parsePullRequestId(process.env.GITHUB_REF);

core.info('GITHUB_CONTEXT' + process.env.GITHUB_CONTEXT);
core.info('pullRequestId:' + pullRequestId);