#!/usr/bin/env node
import {saveNote,comeback} from './index.js';
const help='what-was-i-doing [show | note --next "your next step" [--bookmark "text only"]] [--cwd directory]\nJSON output. Git metadata and explicit notes only; no LLM or shell history. Bookmark never executes.\nNotes stay in Git metadata, not tracked source. Do not save secrets.';
try{
 const args=process.argv.slice(2);
 if(args.length===1&&args[0]==='--help')console.log(help);
 else if(args.length===1&&args[0]==='--version')console.log('0.1.0');
 else{
  let cmd='show';if(args[0]==='show'||args[0]==='note')cmd=args.shift();
  const values={};
  for(let i=0;i<args.length;i++){
   const key=args[i];if(!['--cwd','--next','--bookmark'].includes(key))throw Error(`Unexpected option: ${key}`);
   if(Object.hasOwn(values,key))throw Error(`Duplicate ${key}`);
   const value=args[++i];if(value===undefined)throw Error(`Missing value: ${key}`);values[key]=value;
  }
  const cwd=values['--cwd']||process.cwd();
  if(cmd==='show'&&(values['--next']!==undefined||values['--bookmark']!==undefined))throw Error('Note options require note command');
  console.log(JSON.stringify(cmd==='note'?saveNote(cwd,{nextStep:values['--next'],bookmark:values['--bookmark']}):comeback(cwd),null,2));
 }
}catch(e){console.error(JSON.stringify({error:e.message}));process.exitCode=1;}
