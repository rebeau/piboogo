import axios from 'axios';
const API_VERSION = process.env.CUSTOM_API_VERSION;

const issueApiInstance = axios.create({
  baseURL: process.env.CUSTOM_API_URL,
  timeout: process.env.CUSTOM_API_TIMEOUT,
});

const apiFunction = async (url, { body = {} }) => {
  try {
    console.log(`[ >> ISSUE-API-REQ ] URL '${url}' PARAMS`, body);
    const result = await issueApiInstance.get(url, {
      params: body,
      header: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
    console.log(
      `[ << ISSUE-API-RES  ] api: ${url}, response: `,
      result.status === 200 ? result.data : result,
    );
    return result;
  } catch (error) {
    console.log('ISSUE TOKEN API ERROR', error);
    return error;
  }
};

const patchIssueAccessToken = async (param) => {
  const result = await apiFunction(API_VERSION + `/cs-user/refresh-token`, {
    body: param,
  });
  return result;
};

const issueApi = {
  patchIssueAccessToken,
};

export default issueApi;
