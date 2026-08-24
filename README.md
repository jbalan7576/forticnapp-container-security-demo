# FortiCNAPP + GitHub Actions + GHCR Demo

A minimal Node.js web application demonstrating a container-security gate:

Git push -> Docker build -> FortiCNAPP Inline Scanner -> Critical policy violation stops workflow -> GHCR push only after a passing scan.

## 1. Prerequisites

- GitHub repository
- GitHub Actions enabled
- FortiCNAPP Inline Scanner integration
- A FortiCNAPP container vulnerability policy configured to block Critical violations
- The policy attached to the Inline Scanner integration
- Two GitHub Actions secrets:
  - `LW_ACCOUNT_NAME`
  - `LW_ACCESS_TOKEN`

The access token should be the token generated for the FortiCNAPP Inline Scanner integration, not a source-code credential.

## 2. Configure FortiCNAPP

In FortiCNAPP:

1. Go to Settings -> Integrations -> Container Registries.
2. Create/select an Inline Scanner integration.
3. Configure a Container Vulnerability Policy.
4. Set the policy to block Critical vulnerabilities.
5. Associate the policy with the Inline Scanner integration.
6. Copy the Inline Scanner account name/token into GitHub Actions secrets.

The workflow uses `--policy` and `--critical-violation-exit-code 2`. A Critical policy violation therefore makes the scanner exit non-zero and the GitHub job stops before the GHCR login/push steps.

## 3. Add GitHub secrets

Repository -> Settings -> Secrets and variables -> Actions -> New repository secret.

Create:

`LW_ACCOUNT_NAME`
`LW_ACCESS_TOKEN`

Never commit these values to the repository.

## 4. Push the repository

Replace the placeholder OCI source label in `Dockerfile` with your real repository URL.

Then:

```bash
git init
git branch -M main
git remote add origin https://github.com/<OWNER>/<REPOSITORY>.git
git add .
git commit -m "Add FortiCNAPP container security pipeline"
git push -u origin main
```

Every push to `main` runs the workflow.

Pull requests also build and scan the image, but do not publish it to GHCR.

## 5. Expected behavior

### No Critical policy violation

Build
  -> FortiCNAPP scan passes
  -> report uploaded to GitHub Actions
  -> image pushed to `ghcr.io/<owner>/<repository>:<commit-sha>`
  -> `latest` tag updated

### Critical policy violation

Build
  -> FortiCNAPP scan detects a Critical policy violation
  -> scanner exits with code 2
  -> GitHub Actions job fails
  -> GHCR push steps are skipped

The FortiCNAPP HTML report is uploaded as a GitHub Actions artifact even when the scan fails.

## 6. Important security note

The FortiCNAPP Docker scanner mounts `/var/run/docker.sock` because the inline scanner uses the host Docker daemon to access the locally built image. Treat this workflow as privileged CI infrastructure and do not run untrusted pull-request code in a self-hosted runner with access to a privileged Docker socket.

For the default GitHub-hosted runner, this example is intended for a controlled demonstration. For production, consider pinning third-party action versions to commit SHAs and pinning the FortiCNAPP scanner image to an approved immutable digest.

## 7. Test the gate

To verify the gate without deliberately introducing a real vulnerability into the application, use a FortiCNAPP test image or an approved security-test scenario in a non-production repository.

Do not add known vulnerable dependencies to a production application just to test the gate.

## 8. Reports

The workflow uploads the FortiCNAPP HTML report as the GitHub Actions artifact:

`forticnapp-scan-report`

Open the completed workflow run -> Artifacts -> `forticnapp-scan-report`.
