import React, { useState } from 'react';

import { addTelegramAccount } from '@/function/api/addTelegramAccount';
import { deleteTelegramAccount } from '@/function/api/deleteTelegramAccount';

interface Props {
  setError: (message: string) => void;
  setMsg: (message: string) => void;
}

const TelegramAccountsSettings = ({ setError, setMsg }: Props) => {
  const [telegramUserId, setTelegramUserId] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [telegramUsername, setTelegramUsername] = useState<string>('');
  const [telegramFirstName, setTelegramFirstName] = useState<string>('');
  const [telegramLastName, setTelegramLastName] = useState<string>('');
  const [deleteTelegramUserId, setDeleteTelegramUserId] = useState<string>('');
  const [isTelegramSubmitting, setIsTelegramSubmitting] = useState<boolean>(false);
  const [isTelegramDeleting, setIsTelegramDeleting] = useState<boolean>(false);

  function parseIntegerField(value: string, fieldName: string, isRequired: boolean) {
    const normalized = value.trim();

    if (!normalized) {
      if (isRequired) {
        throw new Error(`${fieldName} is required`);
      }

      return null;
    }

    const parsed = Number(normalized);

    if (!Number.isInteger(parsed)) {
      throw new Error(`${fieldName} must be an integer`);
    }

    return parsed;
  }

  async function addTelegramAccountWrapper(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setMsg('');
      setIsTelegramSubmitting(true);

      const parsedTelegramUserId = parseIntegerField(telegramUserId, 'Telegram user ID', true);
      const parsedChatId = parseIntegerField(chatId, 'Chat ID', false);

      if (parsedTelegramUserId === null) {
        throw new Error('Telegram user ID is required');
      }

      await addTelegramAccount({
        telegramUserId: parsedTelegramUserId,
        chatId: parsedChatId,
        username: telegramUsername.trim() || undefined,
        firstName: telegramFirstName.trim() || undefined,
        lastName: telegramLastName.trim() || undefined,
      });

      setTelegramUserId('');
      setChatId('');
      setTelegramUsername('');
      setTelegramFirstName('');
      setTelegramLastName('');
      setMsg('Telegram account linked');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsTelegramSubmitting(false);
    }
  }

  async function deleteTelegramAccountWrapper(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setMsg('');
      setIsTelegramDeleting(true);

      const parsedTelegramUserId = parseIntegerField(
        deleteTelegramUserId,
        'Telegram user ID',
        true
      );

      if (parsedTelegramUserId === null) {
        throw new Error('Telegram user ID is required');
      }

      await deleteTelegramAccount(parsedTelegramUserId);

      setDeleteTelegramUserId('');
      setMsg('Telegram account deleted');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsTelegramDeleting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={addTelegramAccountWrapper}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '420px',
          marginTop: '20px',
        }}
      >
        <h2>Telegram accounts</h2>
        <label>
          Telegram user ID*
          <input
            type="text"
            inputMode="numeric"
            value={telegramUserId}
            onChange={(e) => {
              setError('');
              setTelegramUserId(e.target.value);
            }}
          />
        </label>
        <label>
          Chat ID (optional)
          <input
            type="text"
            inputMode="numeric"
            value={chatId}
            onChange={(e) => {
              setError('');
              setChatId(e.target.value);
            }}
          />
        </label>
        <label>
          Username (optional)
          <input
            type="text"
            value={telegramUsername}
            onChange={(e) => {
              setError('');
              setTelegramUsername(e.target.value);
            }}
          />
        </label>
        <label>
          First name (optional)
          <input
            type="text"
            value={telegramFirstName}
            onChange={(e) => {
              setError('');
              setTelegramFirstName(e.target.value);
            }}
          />
        </label>
        <label>
          Last name (optional)
          <input
            type="text"
            value={telegramLastName}
            onChange={(e) => {
              setError('');
              setTelegramLastName(e.target.value);
            }}
          />
        </label>
        <button type="submit" disabled={isTelegramSubmitting}>
          {isTelegramSubmitting ? 'Linking...' : 'Link Telegram account'}
        </button>
      </form>

      <form
        onSubmit={deleteTelegramAccountWrapper}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '420px',
          marginTop: '20px',
        }}
      >
        <h2>Delete Telegram account</h2>
        <label>
          Telegram user ID*
          <input
            type="text"
            inputMode="numeric"
            value={deleteTelegramUserId}
            onChange={(e) => {
              setError('');
              setDeleteTelegramUserId(e.target.value);
            }}
          />
        </label>
        <button type="submit" disabled={isTelegramDeleting}>
          {isTelegramDeleting ? 'Deleting...' : 'Delete Telegram account'}
        </button>
      </form>
    </>
  );
};

export default TelegramAccountsSettings;
