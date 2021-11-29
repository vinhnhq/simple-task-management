interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

export async function fetch<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  try {
    const response: HttpResponse<T> = await window.fetch(request);
    if (response.status === 200 || response.status === 201) {
      response.parsedBody = await response.json();
    }

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export async function get<T>(path: string, args: RequestInit = { method: 'get' }): Promise<HttpResponse<T>> {
  return await fetch<T>(new Request(path, args));
}

export async function post<T>(
  path: string,
  body: any,
  args: RequestInit = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
): Promise<HttpResponse<T>> {
  return await fetch<T>(new Request(path, args));
}

export async function put<T>(
  path: string,
  body: any,
  args: RequestInit = {
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
): Promise<HttpResponse<T>> {
  return await fetch<T>(new Request(path, args));
}

export async function del<T>(path: string, args: RequestInit = { method: 'delete' }): Promise<HttpResponse<T>> {
  return await fetch<T>(new Request(path, args));
}
