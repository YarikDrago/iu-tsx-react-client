export async function signup(email: string, nickname: string, password: string) {
  try {
    const url = `${process.env.API_URL}/auth/register`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const reqBody = {
      email: email,
      nickname: nickname,
      password: password,
    };
    const init = {
      method: 'POST',
      headers,
      body: JSON.stringify(reqBody),
    };
    const response = await fetch(url, init);
    const data = await response.json();
    console.log('response:', data);
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
