export async function login(password: string, email: string) {
  try {
    const url = `${process.env.API_URL}/auth/login`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const reqBody = {
      email: email,
      password: password,
    };

    const init = {
      // TODO change to universal
      method: 'POST',
      headers,
      body: JSON.stringify(reqBody),
    };

    console.log('url:', url);

    const response = await fetch(url, init);
    // const response = await
    const data = await response.json();

    console.log('response:', data);

    console.log('log end');

    return data;
  } catch (e) {
    console.log('error');
    // TODO
    console.log(e);
    throw e;
  }
}
