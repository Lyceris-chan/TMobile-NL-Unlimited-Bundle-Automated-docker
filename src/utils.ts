import fetch, { Headers, Response } from "node-fetch";

export async function fetchURI(
  URI: string,
  method: "GET" | "POST",
  headers: Headers,
  name: string,
  body?: string,
  callback?: Function,
  maxRetries: number = 10
) {
  let success: boolean = false;
  let retries = 0;
  while (!success && maxRetries >= retries) {
    await fetch(URI, {
      method: method,
      headers: headers,
      body: body,
    })
      .then(async (response: Response) => {
        try {
          success = await callback(await response);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`${name}: error during callback: ${error}`);
          } else {
            console.error(
              `${name}: something happened during callback: ${error}`
            );
          }
        }
      })
      .catch(async (error: Error) =>
        console.error(`${name} cannot be retrieved: ${error}`)
      );
    retries += 1;
  }
  if (maxRetries <= 0 && !success) {
    console.error(
      `Something went wrong with al ${
        maxRetries + 1
      } tries for ${name}. Not sure what happened.`
    );
  }
}

export function makeHeaders(headersAsObject: object): Headers {
  let headers: Headers = new Headers();
  for (let header of Object.entries(headersAsObject)) {
    headers.set(header[0], header[1]);
  }
  return headers;
}

export function checkENVs() {
  if (
    [process.env.AUTHORIZATIONTOKEN, process.env.MSISDN].includes(
      undefined
    )
  ) {
    console.error("ENV variables not set");
    process.exit();
  }
}

function getInterval(type: 'low' | 'medium' | 'high'): number {
  let intervalEnvVar: string | undefined;
  let defaultInterval: number;

  switch (type) {
    case 'low':
      intervalEnvVar = process.env.UPDATE_INTERVAL_LOW;
      defaultInterval = 0.5; // 0.5 minutes
      break;
    case 'medium':
      intervalEnvVar = process.env.UPDATE_INTERVAL_MEDIUM;
      defaultInterval = 2; // 2 minutes
      break;
    case 'high':
      intervalEnvVar = process.env.UPDATE_INTERVAL_HIGH;
      defaultInterval = 10; // 10 minutes
      break;
    default:
      throw new Error(`Unknown interval type: ${type}`);
  }

  const interval: number = isNaN(parseFloat(intervalEnvVar || "")) ? defaultInterval : parseFloat(intervalEnvVar);
  return minsToMs(interval);
}

function minsToMs(minutes: number): number {
  return minutes * 1000 * 60;
}

export function getDynamicInterval(MBsLeft: number): number {
  if (MBsLeft < 2000) {
    return getInterval('low');
  } else if (MBsLeft < 10000) {
    return getInterval('medium');
  } else {
    return getInterval('high');
  }
}
