const core = require('@actions/core');

const token = core.getInput('token');
const teams = core.getInput('teams'); //teams id


const parsePullRequestId = githubRef => {
  const result = /refs\/pull\/(\d+)\/merge/g.exec(githubRef);
  if (!result) throw new Error("Reference not found.");
  const [, pullRequestId] = result;
  return pullRequestId;
};

const pullRequestId = parsePullRequestId(process.env.GITHUB_REF);

core.info('pullRequestId:' + pullRequestId);