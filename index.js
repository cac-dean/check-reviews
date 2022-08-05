const core = require('@actions/core');

const token = core.getInput('token');
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

async function getMustMember(){
  let url = 'https://api.github.com/teams/' + teams + '/members'
  let reqConfig = {
    "method" : 'get',
    "headers" : {
      "Authorization" : "token " + token
    }
  }

  const data = await request(url, reqConfig);

  let result = [];
  if(data){
    for (const member of data) {
      result.push(member['login']);
    }
  }

  return result;
}

async function getPrReviews(repository, pullRequestId){
  let url = 'https://api.github.com/repos/' + repository + '/pulls/' + pullRequestId + '/reviews'
  core.info("getPrReviews url: " + url);
  let reqConfig = {
    "method" : 'get',
    "headers" : {
      "Authorization" : "token " + token
    }
  }

  const data = await request(url, reqConfig);

  let result = [];
  if(data){
    for (const reviews of data) {
      if(reviews.state === 'APPROVED'){
        result.push(reviews.user.login);
      }
    }
  }

  return result;
}

async function run(){

  const pullRequestId = parsePullRequestId(process.env.GITHUB_REF);
  const repository = process.env.GITHUB_CONTEXT["repository"];
  core.info("repository: " + repository);

  let members = await getMustMember();
  if(!members || members.length == 0){
    core.setFailed('no must members');
    return;
  }
  core.info("must members: " + members.join(','));

  let reviews = await getPrReviews(repository, pullRequestId);
  if(!reviews || reviews.length == 0){
    core.setFailed('no reviews');
    return;
  }
  core.info("reviews: " + reviews.join(','));

  let isPass = false;
  for (const memberName of reviews) {
    if(members.indexOf(memberName) != -1){
      isPass = true;
      break;
    }
  }

  if(!isPass){
    core.setFailed('no must members approved');
  }
}

run();