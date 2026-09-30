import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,writeFileSync,mkdirSync,lstatSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
const git=(cwd,args)=>execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:1048576,env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}}).trimEnd();
function root(cwd){return git(resolve(cwd),['rev-parse','--show-toplevel']);}
function notePath(repo){return resolve(git(repo,['rev-parse','--absolute-git-dir']),'what-was-i-doing.json');}
function safePath(path){let stat;try{stat=lstatSync(path);}catch(e){if(e.code!=='ENOENT')throw e;}if(stat?.isSymbolicLink())throw Error('Refusing a symlink note file');}
export function saveNote(cwd,{nextStep,bookmark}={}){
 const repo=root(cwd);const path=notePath(repo);safePath(path);
 if(typeof nextStep!=='string'||!nextStep.trim()||Buffer.byteLength(nextStep)>8192)throw Error('nextStep must be nonempty, at most 8 KiB');
 if(bookmark!==undefined&&(typeof bookmark!=='string'||Buffer.byteLength(bookmark)>8192))throw Error('bookmark must be text, at most 8 KiB');
 const record={version:1,savedAt:new Date().toISOString(),head:git(repo,['rev-parse','HEAD']),branch:git(repo,['branch','--show-current'])||'(detached)',nextStep,bookmark:bookmark??null};
 mkdirSync(dirname(path),{recursive:true});writeFileSync(path,JSON.stringify(record,null,2)+'\n',{mode:0o600,flag:'w'});
 return {saved:true,...record};
}
export function comeback(cwd){
 const repo=root(cwd);const path=notePath(repo);safePath(path);let note=null;
 if(existsSync(path)){
  if(lstatSync(path).size>32768)throw Error('Note file exceeds 32 KiB');
  note=JSON.parse(readFileSync(path,'utf8'));
  if(note.version!==1||typeof note.nextStep!=='string'||typeof note.head!=='string'||typeof note.savedAt!=='string')throw Error('Invalid note file');
 }
 const head=git(repo,['rev-parse','HEAD']);
 // Only metadata; deliberately no diff bodies, env, shell history or remote URLs.
 return {version:1,branch:git(repo,['branch','--show-current'])||'(detached)',head,dirtyStatus:git(repo,['status','--short','--untracked-files=normal']),recentCommits:git(repo,['log','-5','--format=%h %s']),note,noteFromDifferentHead:note?note.head!==head:null,limits:'Explicit note plus Git metadata only. No inferred progress, test results or executed bookmarks.'};
}
