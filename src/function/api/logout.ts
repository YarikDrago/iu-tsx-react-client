import appData from '@/app.data';

export async function logout() {
  try {
    const url = `${process.env.API_URL}/auth/logout`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const init = {
      method: 'POST',
      headers,
    };
    const response = await fetch(url, init);

    // const response = await
    const data = await response.json();
    console.log('response:', data);
    appData.nickname = '';
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
