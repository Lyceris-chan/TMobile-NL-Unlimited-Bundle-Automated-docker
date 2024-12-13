> Based on: https://gathering.tweakers.net/forum/view_message/69930184

# Odido Unlimited Auto Bundle Requester

### Without needing to sniff your URL every month.
It runs every 10, 2 or 0.5 mins (can be set with ENV variables), and requests new bundle when MB's is less than 2000.
Firstly a login token is retrieved via the "regular" log in URL, from which a Bearer token is retrieved.
With the Bearer token the regular API is used to request: current bundles, how much is left on these bundles and then (when needed) a new bundle is requested.
Every request is retried at least 10 times when a request fails.
PM2 is used so it should restart if it crashes.

## Usage (production)
There are 3 main ways to use this software in production:
1. running the Node.js locally
2. running it as a Docker container
3. running it as a Docker container via docker-compose

## Authorization Token
To run this script, an authorization token is needed.
Obtain the token using the **Odido Authenticator tool**:
[Odido Authenticator latest Release](https://github.com/GuusBackup/Odido.Authenticator/releases/latest)

## Buying Code
The Buying code is stored in the environment variable `BUYINGCODE`, and by default, the value is set to `A0DAY01`, which is used for the `2 GB-aanvuller NL` bundle.

To select a different bundle:
1. First, enable DEBUG mode by setting `DEBUG=1`.
2. Ensure that you've utilized at least 80% of the data in your current bundle.
3. Next, review the available bundles in the logs to determine the correct bundle code.
4. Once you've identified the desired bundle code, update the `BUYINGCODE` environment variable with the new code.

### Configure intervales
Based on the amount of MBs left, the intervals do change.
* More than 10GB available, default interval is 10 min. (Overwrite via env var `UPDATE_INTERVAL_HIGH`)
* Less than 10GB available, default interval is 2 min. (Overwrite via env var `UPDATE_INTERVAL_MEDIUM`)
* Less than 2GB available, default interval is 0.5 min. (Overwrite via env var `UPDATE_INTERVAL_LOW`)

### Node.js with Yarn/NPM
1. `git clone https://github.com/lodu/TMobile-NL-Unlimited-Bundle-Automated`
2. `yarn` or `npm install`
3.  create a file called `.env` in root folder with contents:
      ```bash
      AUTHORIZATIONTOKEN=xxxxxxxxxx
      MSISDN=+3161234567890
      UPDATE_INTERVAL_HIGH=10
      UPDATE_INTERVAL_MEDIUM=2
      UPDATE_INTERVAL_LOW=0.5
      BUYINGCODE=A0DAY01
      DEBUG=0
      ```
2.  `yarn build` or `npm run build`
3.  `yarn start-daemon` or `npm run start-daemon`
4. Done


### Docker
1.  create a file called `.env`:
      ```bash
      AUTHORIZATIONTOKEN=xxxxxxxxxx
      MSISDN=+3161234567890
      UPDATE_INTERVAL_HIGH=10
      UPDATE_INTERVAL_MEDIUM=2
      UPDATE_INTERVAL_LOW=0.5
      BUYINGCODE=A0DAY01
      DEBUG=0
      ```
2. `docker pull ghcr.io/lodu/tmobile-nl-unlimited-bundle-automated:main`
3. `docker run --env-file .env ghcr.io/lodu/tmobile-nl-unlimited-bundle-automated:main`

### docker-compose
1.  create a file called `.env`:
      ```bash
      AUTHORIZATIONTOKEN=xxxxxxxxxx
      MSISDN=+3161234567890
      UPDATE_INTERVAL_HIGH=10
      UPDATE_INTERVAL_MEDIUM=2
      UPDATE_INTERVAL_LOW=0.5
      BUYINGCODE=A0DAY01
      DEBUG=0
      ```
2. copy [`docker-compose.yaml`](./docker-compose.yaml) to a local `docker-compose.yaml` file
3. `docker-compose up -d`

## Development
1. `git clone` the repo (duhh)
2. Create `.env` file in root directory:
   ```bash
   AUTHORIZATIONTOKEN=xxxxxxxxxx
   MSISDN=+3161234567890
   UPDATE_INTERVAL_HIGH=10
   UPDATE_INTERVAL_MEDIUM=2
   UPDATE_INTERVAL_LOW=0.5
   BUYINGCODE=A0DAY01
   DEBUG=0
   ```
3. Install packages: `yarn` or `npm install`

4. Run  in development for filewatcher `yarn dev` or `npm run dev`

5. Do ya thing.

## PR's

PR's/MR's are welcomed if you have any additions and or points of improvement

## Issues
Please feel free to open an issue, I'm glad to help.
However do not use it as a tech support please...
