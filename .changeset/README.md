# Changesets

Every change to a published package needs a changeset: run `npx changeset`, pick the packages and
the bump, and describe the change for the changelog. Commit the file with the change.

On `main`, the release workflow opens a "Version packages" pull request that applies the pending
changesets. Merging it publishes the new versions to npm.
