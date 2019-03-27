'use strict';
const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const mainTemplate = readFileSync(resolve(__dirname, 'templates/template.hbs')).toString();
const headerPartial = readFileSync(resolve(__dirname, 'templates/header.hbs')).toString();
const commitPartial = readFileSync(resolve(__dirname, 'templates/commit.hbs')).toString();

/** @typedef {{type: string, header: string, hash?: string, message?: string, PR?: string}} Commit */

const pullRequestRegex = /\(#(\d+)\)$/;
const parserOpts = {
  headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
  headerCorrespondence: [
    'type',
    'scope',
    'message',
  ],
};

// process.stderr.write(`
// > Be sure to have the latest git tags locally:
//     git fetch --tags
// `);

const writerOpts = {
  mainTemplate,
  headerPartial,
  commitPartial,
  /** @param {Commit} commit */
  transform: commit => {
    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.substring(0, 7);
    }

    if (commit.type === 'docs') {
      commit.type = 'Documentation';
    } else if (commit.type === 'test') {
      commit.type = 'tests';
    } else if (commit.type === 'revert') {
      commit.type = 'Reverts';
    } else if (commit.type === 'style') {
      commit.type = 'Styles';
    }

    if (commit.type) {
      commit.type = commit.type.replace(/_/g, ' ');
      commit.type = commit.type.substring(0, 1).toUpperCase() + commit.type.substring(1);
    } else {
      commit.type = 'Misc';
    }

    if (typeof commit.hash === `string`) {
      commit.hash = commit.hash.substring(0, 7);
    }

    let pullRequestMatch = commit.header.match(pullRequestRegex);
    // if header does not provide a PR we try the message
    if (!pullRequestMatch && commit.message) {
      pullRequestMatch = commit.message.match(pullRequestRegex);
    }

    if (pullRequestMatch) {
      commit.header = commit.header.replace(pullRequestMatch[0], '-----').trim();
      if (commit.message) {
        commit.message = commit.message.replace(pullRequestMatch[0], '------').trim();
      }

      commit.PR = pullRequestMatch[1];
    }

    return commit;
  },
  groupBy: 'type',
  /** @param {{title: string}} a @param {{title: string}} b */
  commitGroupsSort: (a, b) => {
    // put misc on the bottom
    if (a.title === 'Misc') {
      return 1;
    }
    if (b.title === 'Misc') {
      return -1;
    }

    return a.title.localeCompare(b.title);
  },
  commitsSort: ['type', 'scope'],
};

module.exports = {
  writerOpts,
  parserOpts,
};
