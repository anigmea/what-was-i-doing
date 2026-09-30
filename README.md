# what-was-i-doing

The repo is familiar. The intent is not.

A local comeback card: branch, recent commit subjects, dirty filenames and a next step YOU wrote. No LLM, remote service, shell-history collection, diff bodies or invented progress. Bookmarked commands are text only and never run.

Status: unpublished 0.1.0 candidate. Node 18+, Git on PATH, ESM. Zero runtime dependencies.

## Reviewed checkout

```sh
npm ci
npm test
node src/cli.js show --cwd /path/to/project
node src/cli.js note --cwd /path/to/project --next 'Reproduce the empty-input parser bug' --bookmark 'npm test'
```

After publication: `npx what-was-i-doing show` from your Git repo.

All results are JSON. Show reads Git metadata and an optional note. Note explicitly writes a local record in the repository's Git metadata directory, outside tracked source. No shell hooks, background watcher, telemetry or automatic note update.

## What you get

- Current branch/HEAD, including detached HEAD.
- Up to five recent commit subjects.
- Git short status (changed/untracked filenames, not file contents).
- Your stored next step and optional bookmark, with saved time and original HEAD.
- `noteFromDifferentHead: true` if the note came from an earlier HEAD. Old intent stays labeled, not rewritten as current intent.

Git file/commit names and user notes can contain private information. This is NOT a secret scanner. Do not put secrets in notes or share a card without reviewing it. The tool does not upload anything itself.

## Limits

Requires an existing repository with at least one commit. No inference of tests passed, tasks completed, business impact or blockers. It does not capture unstaged code diffs or recover lost files. It cannot know whether your saved next step is still wise or whether a bookmark is safe.

The note is plaintext with a requested owner-only file mode; permissions vary by OS. Existing files may retain their permissions. Symlink note files are refused, but this is not protection against a malicious concurrently modifying local filesystem. Notes are per-worktree Git directory, not portable across clones; they can disappear when metadata is removed.

Git commands used are read-only (`rev-parse`, `branch`, `status`, `log`), invoked without a shell. Git still relies on your local installation/configuration. Metadata output is bounded at 1 MiB per command; note text at 8 KiB per field. Large status output fails rather than silently presenting an incomplete card. Malformed notes fail rather than being guessed.

Existing resume and ctx-switch tools cover similar return-to-project workflows with LLM briefings. This is a smaller explicit-note/no-model alternative, not a uniqueness claim.

## Release

`npm publish --access public` runs offline tests. Owner review/merge and a separate publish go-ahead required. Source is runtime format; tests and project notes are excluded from the npm archive. MIT.
