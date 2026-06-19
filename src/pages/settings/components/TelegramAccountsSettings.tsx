import React, { useEffect, useState } from 'react';

import { addTelegramAccount, UserTelegramAccountDto } from '@/function/api/addTelegramAccount';
import { deleteTelegramAccount } from '@/function/api/deleteTelegramAccount';
import {
  getTelegramAccounts,
  GetTelegramAccountsResponse,
} from '@/function/api/getTelegramAccounts';

interface Props {
  setError: (message: string) => void;
  setMsg: (message: string) => void;
}

type TelegramAccountForm = {
  key: string;
  telegramUserId: string;
  chatId: string;
  username: string;
  firstName: string;
  lastName: string;
  original: UserTelegramAccountDto | null;
  isSaving: boolean;
  isDeleting: boolean;
};

type TelegramAccountField = Exclude<
  keyof TelegramAccountForm,
  'key' | 'original' | 'isSaving' | 'isDeleting'
>;

function normalizeTelegramAccountForm(form: TelegramAccountForm): UserTelegramAccountDto {
  const telegramUserId = Number(form.telegramUserId.trim());
  const chatId = form.chatId.trim() ? Number(form.chatId.trim()) : null;

  return {
    telegramUserId,
    chatId,
    username: form.username.trim() || undefined,
    firstName: form.firstName.trim() || undefined,
    lastName: form.lastName.trim() || undefined,
  };
}

function createTelegramAccountForm(
  account?: GetTelegramAccountsResponse,
  key = `${Date.now()}-${Math.random()}`
): TelegramAccountForm {
  if (!account) {
    return {
      key,
      telegramUserId: '',
      chatId: '',
      username: '',
      firstName: '',
      lastName: '',
      original: null,
      isSaving: false,
      isDeleting: false,
    };
  }

  const form = {
    key,
    telegramUserId: account.telegramUserId ?? '',
    chatId: account.chatId ?? '',
    username: account.username ?? '',
    firstName: account.firstName ?? '',
    lastName: account.lastName ?? '',
    original: null,
    isSaving: false,
    isDeleting: false,
  };

  return {
    ...form,
    original: normalizeTelegramAccountForm(form),
  };
}

const TelegramAccountsSettings = ({ setError, setMsg }: Props) => {
  const [telegramAccounts, setTelegramAccounts] = useState<TelegramAccountForm[]>([]);

  useEffect(() => {
    getTelegramAccountsWrapper();
  }, []);

  async function getTelegramAccountsWrapper() {
    try {
      const resp = await getTelegramAccounts();
      setTelegramAccounts(resp.map((account) => createTelegramAccountForm(account, account.id)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

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

  function isSameTelegramAccount(
    currentAccount: UserTelegramAccountDto,
    originalAccount: UserTelegramAccountDto | null
  ) {
    if (!originalAccount) {
      return false;
    }

    return (
      currentAccount.telegramUserId === originalAccount.telegramUserId &&
      currentAccount.chatId === originalAccount.chatId &&
      currentAccount.username === originalAccount.username &&
      currentAccount.firstName === originalAccount.firstName &&
      currentAccount.lastName === originalAccount.lastName
    );
  }

  function isTelegramAccountSaveDisabled(account: TelegramAccountForm) {
    if (account.isSaving || !account.telegramUserId.trim()) {
      return true;
    }

    const normalizedTelegramUserId = Number(account.telegramUserId.trim());
    const normalizedChatId = account.chatId.trim() ? Number(account.chatId.trim()) : null;

    if (
      !Number.isInteger(normalizedTelegramUserId) ||
      (account.chatId.trim() && !Number.isInteger(normalizedChatId))
    ) {
      return false;
    }

    return isSameTelegramAccount(normalizeTelegramAccountForm(account), account.original);
  }

  function updateTelegramAccountField(
    accountKey: string,
    fieldName: TelegramAccountField,
    value: string
  ) {
    setError('');
    setTelegramAccounts((accounts) =>
      accounts.map((account) =>
        account.key === accountKey ? { ...account, [fieldName]: value } : account
      )
    );
  }

  function addTelegramAccountField() {
    setError('');
    setMsg('');
    setTelegramAccounts((accounts) => [...accounts, createTelegramAccountForm()]);
  }

  async function saveTelegramAccountWrapper(e: React.FormEvent, accountKey: string) {
    e.preventDefault();

    const account = telegramAccounts.find((item) => item.key === accountKey);

    if (!account) {
      return;
    }

    try {
      setError('');
      setMsg('');
      setTelegramAccounts((accounts) =>
        accounts.map((item) => (item.key === accountKey ? { ...item, isSaving: true } : item))
      );

      const parsedTelegramUserId = parseIntegerField(
        account.telegramUserId,
        'Telegram user ID',
        true
      );
      const parsedChatId = parseIntegerField(account.chatId, 'Chat ID', false);

      if (parsedTelegramUserId === null) {
        throw new Error('Telegram user ID is required');
      }

      const savedTelegramAccount = {
        telegramUserId: parsedTelegramUserId,
        chatId: parsedChatId,
        username: account.username.trim() || undefined,
        firstName: account.firstName.trim() || undefined,
        lastName: account.lastName.trim() || undefined,
      };

      await addTelegramAccount(savedTelegramAccount);

      setTelegramAccounts((accounts) =>
        accounts.map((item) =>
          item.key === accountKey
            ? {
                ...item,
                telegramUserId: String(savedTelegramAccount.telegramUserId),
                chatId:
                  savedTelegramAccount.chatId === null ? '' : String(savedTelegramAccount.chatId),
                username: savedTelegramAccount.username ?? '',
                firstName: savedTelegramAccount.firstName ?? '',
                lastName: savedTelegramAccount.lastName ?? '',
                original: savedTelegramAccount,
              }
            : item
        )
      );
      setMsg('Telegram account saved');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setTelegramAccounts((accounts) =>
        accounts.map((item) => (item.key === accountKey ? { ...item, isSaving: false } : item))
      );
    }
  }

  async function deleteTelegramAccountWrapper(accountKey: string) {
    const account = telegramAccounts.find((item) => item.key === accountKey);

    if (!account) {
      return;
    }

    try {
      setError('');
      setMsg('');
      setTelegramAccounts((accounts) =>
        accounts.map((item) => (item.key === accountKey ? { ...item, isDeleting: true } : item))
      );

      const parsedTelegramUserId = parseIntegerField(
        account.telegramUserId,
        'Telegram user ID',
        true
      );

      if (parsedTelegramUserId === null) {
        throw new Error('Telegram user ID is required');
      }

      await deleteTelegramAccount(parsedTelegramUserId);

      setTelegramAccounts((accounts) => accounts.filter((item) => item.key !== accountKey));
      setMsg('Telegram account deleted');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setTelegramAccounts((accounts) =>
        accounts.map((item) => (item.key === accountKey ? { ...item, isDeleting: false } : item))
      );
    }
  }

  return (
    <>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        <h2>Telegram accounts</h2>

        {telegramAccounts.map((account, index) => (
          <form
            key={account.key}
            onSubmit={(e) => saveTelegramAccountWrapper(e, account.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxWidth: '420px',
            }}
          >
            <h3>Account {index + 1}</h3>
            <label>
              Telegram user ID*
              <input
                type="text"
                inputMode="numeric"
                value={account.telegramUserId}
                onChange={(e) =>
                  updateTelegramAccountField(account.key, 'telegramUserId', e.target.value)
                }
              />
            </label>
            <label>
              Chat ID (optional)
              <input
                type="text"
                inputMode="numeric"
                value={account.chatId}
                onChange={(e) => updateTelegramAccountField(account.key, 'chatId', e.target.value)}
              />
            </label>
            <label>
              Username (optional)
              <input
                type="text"
                value={account.username}
                onChange={(e) =>
                  updateTelegramAccountField(account.key, 'username', e.target.value)
                }
              />
            </label>
            <label>
              First name (optional)
              <input
                type="text"
                value={account.firstName}
                onChange={(e) =>
                  updateTelegramAccountField(account.key, 'firstName', e.target.value)
                }
              />
            </label>
            <label>
              Last name (optional)
              <input
                type="text"
                value={account.lastName}
                onChange={(e) =>
                  updateTelegramAccountField(account.key, 'lastName', e.target.value)
                }
              />
            </label>
            <button type="submit" disabled={isTelegramAccountSaveDisabled(account)}>
              {account.isSaving ? 'Saving...' : 'Save Telegram account'}
            </button>
            <button
              type="button"
              disabled={account.isDeleting || !account.telegramUserId.trim()}
              onClick={() => deleteTelegramAccountWrapper(account.key)}
            >
              {account.isDeleting ? 'Deleting...' : 'Delete Telegram account'}
            </button>
          </form>
        ))}

        <button type="button" onClick={addTelegramAccountField} style={{ maxWidth: '420px' }}>
          Add Telegram account
        </button>
      </section>
    </>
  );
};

export default TelegramAccountsSettings;
