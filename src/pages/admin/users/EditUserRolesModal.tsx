import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import appData from '@/app.data';
import { AdminUserListItem } from '@/function/api/adminUsers';
import { USER_ROLES } from '@/shared/constants/userRoles';

import * as styles from './AdminUsers.module.scss';

type EditUserRolesModalProps = {
  user: AdminUserListItem;
  availableRoles: string[];
  onCancel: () => void;
  onSave: (roles: string[]) => Promise<void>;
};

const EditUserRolesModal = ({
  user,
  availableRoles,
  onCancel,
  onSave,
}: EditUserRolesModalProps) => {
  const portalRoot = useMemo(() => document.getElementById('modal-root') ?? document.body, []);
  const [selectedRoles, setSelectedRoles] = useState(
    () => new Set(user.roles.filter((role) => availableRoles.includes(role)))
  );
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSaving) onCancel();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSaving, onCancel]);

  const toggleRole = (role: string) => {
    setSelectedRoles((currentRoles) => {
      const nextRoles = new Set(currentRoles);

      if (nextRoles.has(role)) nextRoles.delete(role);
      else nextRoles.add(role);

      return nextRoles;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setIsSaving(true);

    try {
      await onSave(availableRoles.filter((role) => selectedRoles.has(role)));
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const content = (
    <div className={styles.modalOverlay} onClick={() => !isSaving && onCancel()}>
      <section
        className={styles.rolesModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editUserRolesTitle"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <h2 id="editUserRolesTitle">Edit roles</h2>
          <p>
            <strong>{user.nickname}</strong>
            <span>{user.email}</span>
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <fieldset className={styles.roleOptions} disabled={isSaving}>
            <legend>Available roles</legend>
            {availableRoles.length === 0 ? (
              <p>No roles available.</p>
            ) : (
              availableRoles.map((role) => {
                const isOwnAdminRole =
                  Number(user.id) === Number(appData.userId) && role === USER_ROLES.Admin;

                return (
                  <label key={role}>
                    <input
                      type="checkbox"
                      checked={selectedRoles.has(role)}
                      disabled={isOwnAdminRole || isSaving}
                      onChange={() => toggleRole(role)}
                    />
                    <span>{role}</span>
                  </label>
                );
              })
            )}
          </fieldset>

          {formError && <p className={styles.modalError}>{formError}</p>}

          <div className={styles.modalActions}>
            <button type="button" className="secondary" disabled={isSaving} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="admin" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );

  return createPortal(content, portalRoot);
};

export default EditUserRolesModal;
