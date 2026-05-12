import { CheatsheetTable } from './CheatsheetTable';

const sections = [
  {
    key: 'basics',
    rows: [
      { cmd: 'git init', zh: '初始化仓库', en: 'Initialize a repository' },
      { cmd: 'git clone <url>', zh: '克隆远端仓库', en: 'Clone a remote repository' },
      { cmd: 'git status', zh: '查看工作区状态', en: 'Show working tree status' },
      { cmd: 'git add <path>', zh: '添加到暂存区', en: 'Stage changes' },
      { cmd: 'git commit -m "msg"', zh: '提交暂存区', en: 'Commit staged changes' },
      { cmd: 'git stash', zh: '暂存当前修改', en: 'Stash current changes' },
    ],
  },
  {
    key: 'branch',
    rows: [
      { cmd: 'git branch', zh: '列出本地分支', en: 'List local branches' },
      { cmd: 'git branch <name>', zh: '创建分支', en: 'Create a branch' },
      { cmd: 'git switch <name>', zh: '切换分支', en: 'Switch branch' },
      { cmd: 'git switch -c <name>', zh: '创建并切换', en: 'Create and switch' },
      { cmd: 'git merge <name>', zh: '合并分支', en: 'Merge branch into current' },
      { cmd: 'git rebase <name>', zh: '变基到分支', en: 'Rebase onto branch' },
    ],
  },
  {
    key: 'remote',
    rows: [
      { cmd: 'git remote -v', zh: '查看远端', en: 'Show remotes' },
      { cmd: 'git fetch', zh: '抓取远端更新', en: 'Fetch remote refs' },
      { cmd: 'git pull --rebase', zh: '拉取并变基', en: 'Pull with rebase' },
      { cmd: 'git push', zh: '推送当前分支', en: 'Push current branch' },
      { cmd: 'git push -u origin HEAD', zh: '首次推送并设上游', en: 'Push and set upstream' },
    ],
  },
  {
    key: 'log',
    rows: [
      { cmd: 'git log --oneline --graph', zh: '紧凑图形日志', en: 'Compact graph log' },
      { cmd: 'git log -p <file>', zh: '查看文件提交历史', en: 'File history with diffs' },
      { cmd: 'git diff', zh: '工作区与暂存区差异', en: 'Working tree vs index diff' },
      { cmd: 'git diff --staged', zh: '暂存区与上次提交差异', en: 'Index vs HEAD diff' },
      { cmd: 'git show HEAD', zh: '显示最新提交', en: 'Show latest commit' },
    ],
  },
  {
    key: 'undo',
    rows: [
      { cmd: 'git restore <file>', zh: '丢弃工作区修改', en: 'Discard unstaged changes' },
      { cmd: 'git restore --staged <file>', zh: '取消暂存', en: 'Unstage a file' },
      { cmd: 'git commit --amend', zh: '修改最近提交', en: 'Amend last commit' },
      { cmd: 'git reset --soft HEAD~1', zh: '撤销提交保留改动', en: 'Undo last commit, keep changes' },
      { cmd: 'git revert <sha>', zh: '反向提交', en: 'Revert a commit' },
    ],
  },
];

export default function GitCheatsheet() {
  return <CheatsheetTable ns="git-cheatsheet" sections={sections} />;
}
