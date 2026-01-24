export async function activate(token: string) {
  try {
    const url = `${process.env.API_URL}/auth/activate`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const reqBody = {
      token: token,
    };

    const init = {
      // TODO change to universal
      method: 'POST',
      headers,
      body: JSON.stringify(reqBody),
    };

    const response = await fetch(url, init);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Activate failed: ${response.status} ${data.message}`);
    }

    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
