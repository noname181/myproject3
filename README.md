# Full-Stack Deployment Guide on Vultr with Docker and GitHub Actions

This document explains, step-by-step, how to provision a server on Vultr and deploy the following components using Docker and GitHub Actions:

- React Admin Web (port 3001)
- Flutter Mobile App (build APK from GitHub Actions artifacts)
- Node.js API (port 8081)
- Java OCPP services (WebSocket 8887, API 9999)

All steps are tailored for a Windows workstation initiating the setup.

---

## Prerequisites

- Vultr account (we can provide if needed)
- GitHub account with owner access to the following repositories:
  - `HDO_ADMIN` (React Admin)
  - `HDO_APP` (Flutter App)
  - `HDO_API` (Node.js API)
  - `HDO_OCPP_SERVER` (Java OCPP)
- Windows computer with:
  - PowerShell or Command Prompt
  - SSH client (built into Windows 10/11 PowerShell)
  - Web browser
- AUIGrid license key (will be generated using your server’s public IP)

---

## Architecture & Ports

- Admin Web (React): `http://<server-ip>:3001`
- Node API: `http://<server-ip>:8081` and `http://<server-ip>:8081/v1`
- Java OCPP WebSocket: `ws://<server-ip>:8887`
- Java OCPP API: `http://<server-ip>:9999`

Important: Use HTTP (not HTTPS) per the initial setup in this guide.

---

## Part 1 — Create 4 GitHub repositories and push source to the default `master` branch

You will need 4 separate repositories on GitHub for the CI/CD pipeline, login to GitHub and create the following repositories:

- `HDO_ADMIN` (React Admin)
- `HDO_APP` (Flutter App)
- `HDO_API` (Node.js API)
- `HDO_OCPP_SERVER` (Java OCPP)

### Windows: Install and verify Git

Open Command Prompt first (Start → type "cmd" → Enter), then verify that Git is installed:

```powershell
git --version
```

- If you see a version (e.g., `git version 2.xx.x`), you’re good to go.
- If not installed, choose one of the options below:
  - Using Winget (recommended on Windows 10/11):
    ```powershell
    winget install --id Git.Git -e --source winget
    ```
  - Using Chocolatey (if available):
    ```powershell
    choco install git -y
    ```
  - Manual installer: download from https://git-scm.com/download/win and follow the setup wizard.

Restart your Command Prompt (or Terminal) and run `git --version` again to confirm.

### Folder preparation workflow (empty folder → git init → copy source)

For each project below, follow this sequence:

1) Create an empty folder for the project (e.g., `C:\Projects\HDO_ADMIN`).
2) Open Command Prompt in that empty folder (see tips below).
3) Initialize the repository first with `git init`.
4) Copy your project source files into this folder (paste/drag-drop or unzip here).
5) Then run `git add`, `commit`, `remote add`, and `push` as shown in each section.

### Windows: Open Command Prompt in a project folder

Use one of the following methods to open a Command Prompt directly in the folder where you will run the git commands:

- File Explorer → navigate to the target folder → click the address bar → type `cmd` → press Enter.
- File Explorer → navigate to the target folder → hold Shift and right‑click the empty area → choose "Open in Terminal".


### HDO_ADMIN (React Admin)
Create an empty folder for the repo (e.g., `C:\Projects\HDO_ADMIN`).

Open Command Prompt in `HDO_ADMIN/` that you created, then run the following. 

```bash
git init
```

After `git init`, copy your React Admin source files into this folder, then continue:

```bash
git add .
git commit -m "chore: initial commit (HDO_ADMIN)"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME_OR_ORG>/HDO_ADMIN.git
git push -u origin master
```

### HDO_APP (Flutter App)
Create an empty folder for the repo (e.g., `C:\Projects\HDO_APP`).

Open Command Prompt in `HDO_APP/` that you created, then run the following. 

```bash
git init
```

After `git init`, copy your Flutter source files into this folder, then continue:

```bash
git add .
git commit -m "chore: initial commit (HDO_APP)"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME_OR_ORG>/HDO_APP.git
git push -u origin master
```

### HDO_API (Node.js API)
Create an empty folder for the repo (e.g., `C:\Projects\HDO_API`).

Open Command Prompt in `HDO_API/` that you created, then run the following. 

```bash
git init
```

After `git init`, copy your Node API source files into this folder, then continue:

```bash
git add .
git commit -m "chore: initial commit (HDO_API)"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME_OR_ORG>/HDO_API.git
git push -u origin master
```

### HDO_OCPP_SERVER (Java OCPP)
Create an empty folder for the repo (e.g., `C:\Projects\HDO_OCPP_SERVER`).

Open Command Prompt in `HDO_OCPP_SERVER/` that you created, then run.

```bash
git init
```

After `git init`, copy your Java OCPP source files into this folder, then continue:

```bash
git add .
git commit -m "chore: initial commit (HDO_OCPP_SERVER)"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME_OR_ORG>/HDO_OCPP_SERVER.git
git push -u origin master
```

After pushing your code:

- Go to each repo → Settings → Branches → Default branch → ensure it is set to `master`.
- Enable the Actions tab (if not already) so GitHub can run workflows.
- Configure repository Secrets as instructed later in this document.

---

## Part 2 — Create and Configure a Server on Vultr

1. Sign up at https://www.vultr.com or log in to your existing account.
2. In the top-right, click "Deploy".
3. Choose "Deploy New Server".
4. Step 1: Select Location & Plan
   - Choose Type: Shared CPU
   - Region: Asia
   - Location: Seoul
   - Plan: Any plan (e.g., 2 vCPUs, 4GB RAM)
   - Disable Automatic Backups
   - Click Configure Software (proceed to Step 2)
5. Step 2: Configure Software & Deploy Instance
   - Operating System: Ubuntu 25.xx
   - Additional Features:Enable Public IPv6
   - Click "Deploy" to create the instance
6. Navigate to "Dashboard" → "Compute" → select the instance you just created
   - Wait until Status shows "Running"
   - Open the instance details page

### Configure Vultr Firewall

1. Go to the instance → "Settings" → "Firewall" → "Manage"
2. Click "Add Firewall Group", add a Description, then click "Add Firewall Group"
3. Add inbound rules for IPv4:
   - Select Protocol as SSH, enter the Port 22 and select Source as Everywhere (allow SSH logins)
   - Select Protocol as TCP, enter the Port 3001 and select Source as Everywhere (React Admin)
   - Select Protocol as TCP, enter the Port 8081 and select Source as Everywhere (Node API)
   - Select Protocol as TCP, enter the Port 8887 and select Source as Everywhere (Java WebSocket)
   - Select Protocol as TCP, enter the Port 9999 and select Source as Everywhere (Java API)
4. Go back to the instance → "Settings" → "Firewall"
   - Attach the firewall group you created
   - Click "Update Firewall Group"
5. In the instance "Overview", note the following for SSH access:
   - IP Address
   - Username
   - Password

---

## Part 3 — SSH to the Server (Windows)

Open PowerShell or Command Prompt on Windows, then type to run:

```powershell
ssh <username>@<server-ip>
```
Example:

```powershell
ssh root@139.180.210.178
```

- Enter the password shown in the Vultr instance overview when prompted.

---

## Part 4 — Install Docker Engine on Ubuntu

Follow Docker’s official installation steps (reference: https://docs.docker.com/engine/install/). Below are the exact commands for Ubuntu 25.xx, copy and run one by one on terminal:

Add Docker's official GPG key:
```sh
sudo apt-get update
```
```sh
sudo apt-get install -y ca-certificates curl
```
```sh
sudo install -m 0755 -d /etc/apt/keyrings
```
```sh
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
```
```sh
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Add the repository to Apt sources:
```sh
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
```sh
sudo apt-get update
```

Install Docker Engine and plugins:
```sh
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Configure Docker daemon DNS (for internet access inside containers)

```sh
sudo vi /etc/docker/daemon.json
```

- Press `I` to enter insert mode and paste the following:

```json
{
  "dns": ["8.8.8.8", "1.1.1.1"]
}
```

- Press `Esc`, then type `:wq` and press `Enter` to save and exit.
- Reload and restart Docker:

```sh
sudo systemctl daemon-reload
```
```sh
sudo systemctl restart docker
```

### Create a Docker Network

```sh
docker network create hdoNetwork
```

This network can be referenced by your containers for inter-service communication if needed.

---

## Part 5 — Obtain AUIGrid License for Admin Web

1. Visit https://www.auisoft.net/dcenter.html#
2. In section 2, add the newly created server’s public IP address
3. Fill sections 3, 4, 5 with your details (e.g., Name: Rian, Company: Rian, Email: riansoft.info@gmail.com)
4. Accept all terms
5. Click 확인 (Confirm)
6. Your browser will download a compressed archive containing AUIGrid files
7. Extract the archive, open the `AUIGrid` folder, and open `AUIGridLicense.js` in a text editor
8. Copy the value of `AUIGridLicense` (the string after the `=` in quotes). You will need this for the React Admin secret.

---

## Part 6 — Configure GitHub Secrets for Each Repository

You will configure GitHub Actions secrets in each repository under:

GitHub → Target Repository → Settings → Secrets and variables → Actions → Repository secrets

Make the changes below, then trigger the workflows as described in Part 6.

### A. Flutter App — `HDO_APP`

- Update the following secrets:
  - `SERVER_URL` → `http://<server-ip>:8081` (e.g., `http://141.164.48.108:8081`)
  - `SERVER_URL_V1` → `http://<server-ip>:8081/v1` (e.g., `http://141.164.48.108:8081/v1`)

### B. React Admin — `HDO_ADMIN`

- Update the following secrets:
  - `VPS_HOST` → `<server-ip>`
  - `VPS_USER` → `<server-username>`
  - `VPS_SSH_KEY` → `<server-password>`
    - Note: The name suggests an SSH key, but per these steps use the server password if your workflow is configured for password-based SSH.
  - `REACT_APP_API_URL` → `http://<server-ip>:8081`
  - `REACT_APP_AUIGRID_LICENSE` → `<AUIGridLicense string from Part 4>`
  - Add the corresponding secrets from the attached .env.hdo_admin file to GitHub Secrets.

### C. Node API — `HDO_API`

- Update the following secrets:
  - `VPS_HOST` → `<server-ip>`
  - `VPS_USER` → `<server-username>`
  - `VPS_SSH_KEY` → `<server-password>`
  - `HOST` → `<server-ip>`
  - Add the corresponding secrets from the attached .env.hdo_api file to GitHub Secrets.

### D. Java OCPP — `HDO_OCPP_SERVER`

- Update the following secrets:
  - `VPS_HOST` → `<server-ip>`
  - `VPS_USER` → `<server-username>`
  - `VPS_SSH_KEY` → `<server-password>`
  - Add the corresponding secrets from the attached .env.hdo_ocpp file to GitHub Secrets.

---

## Part 7 — Trigger GitHub Actions Workflows

For each repository:

1. Go to the repository → "Actions"
2. Select the latest workflow
3. Click "Re-run all jobs"

Estimated build times:

- Flutter App (`HDO_APP`): 20–30 minutes
  - After completion, check the "Artifacts" section
  - Download `apk-dev-arm64` artifact
  - Unzip and install the APK on your Android device for testing
- React Admin (`HDO_ADMIN`): ~5–6 minutes to build and deploy to the server
  - Verify at: `http://<server-ip>:3001`
- Node API (`HDO_API`): ~3–4 minutes to build and deploy
  - Verify at: `http://<server-ip>:8081`
- Java OCPP (`HDO_OCPP_SERVER`): ~2–3 minutes to build and deploy
  - Verify at: `http://<server-ip>:9999`

Important: Use HTTP (not HTTPS).

---

## Part 8 — Post-Deployment Verification

- Admin Web: open `http://<server-ip>:3001`
- Node API base: `http://<server-ip>:8081`
- Node API v1: `http://<server-ip>:8081/v1`
- Java OCPP API: `http://<server-ip>:9999`
- Java OCPP WebSocket: `ws://<server-ip>:8887`

If any endpoint is unreachable, review the Troubleshooting section below.

---

## Glossary (for non-developers)

- Repository (Repo): A project on GitHub that stores your code and history.
- Branch: A line of development in a repo (e.g., `master`).
- Commit: A saved snapshot of your code with a message.
- Push: Upload your local commits to the GitHub repo.
- Pull Request (PR): A request to merge changes from one branch into another.
- Workflow (GitHub Actions): An automated process (build, test, deploy) that runs on GitHub.
- Artifact: A file produced by a workflow (e.g., an Android APK or iOS IPA) that you can download.
- Secret: An encrypted key/value stored in GitHub to keep credentials safe for workflows.
- Environment variable: A key/value available to scripts/workflows (e.g., `SERVER_URL`).
- Flutter: A framework to build mobile apps from a single codebase.
- Dart: The programming language used by Flutter.
- Xcode: Apple’s macOS tool for building iOS apps.
- IPA: The packaged iOS app file (similar to APK on Android) used for TestFlight/App Store.
- Provisioning Profile: Apple file that allows code signing and installing on devices/stores.
- Team ID: Your Apple Developer team identifier used for signing.
- Bundle Identifier: The unique iOS app id (e.g., `com.hdoilbank.evnu.ios`).
- CocoaPods: Dependency manager for iOS projects (installs iOS libraries).
- Fastlane: Automation tool to upload apps to TestFlight/App Store, manage signing, etc.
- Docker: A tool to package apps into containers for consistent deployment.
- Image (Docker): The template (recipe) used to create running containers.
- Container (Docker): A running instance of an image.
- Network (Docker): A virtual network for containers to talk to each other.
- Port: The numbered door used to access services (e.g., `8081`).
- Firewall: Rules that allow/block network traffic to your server.

---

## Troubleshooting

- Firewall rules
  - Ensure inbound IPv4 rules are present for ports 22, 3001, 8081, 8887, 9999 in the Vultr firewall group attached to the instance.
- Docker service
  - Check Docker status: `sudo systemctl status docker`
  - Restart Docker: `sudo systemctl restart docker`
- Docker networking
  - Confirm the custom network exists: `docker network ls` and ensure `hdoNetwork` is listed
  - If containers rely on DNS, ensure `/etc/docker/daemon.json` has the DNS entries and Docker was restarted
- Containers & logs
  - List running containers: `docker ps`
  - View logs: `docker logs <container_name_or_id>`
  - Check port bindings: `docker ps --format "table {{.Names}}\t{{.Ports}}"`
- GitHub Actions
  - Open workflow run logs to see exact failure messages
  - Verify that all required secrets are set and correctly named
- SSH access
  - Confirm correct username, IP, and password from Vultr instance overview
  - First-time SSH may prompt to trust the host fingerprint — answer `yes`
- IPv6
  - If IPv6 is enabled and your workflows/scripts bind to IPv6, verify corresponding firewall rules; otherwise use IPv4 addresses consistently

---

## Next Steps

You have now:

- Built the user mobile APK (Flutter) via GitHub Actions
- Built and deployed the React Admin to the server
- Deployed the Node API and Java OCPP services to the server

Proceed to test system features according to your product documentation and usage guides.

If you need to enable HTTPS, configure a reverse proxy (e.g., Nginx or Caddy) and TLS certificates (e.g., Let’s Encrypt) in a future iteration.
