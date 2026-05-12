import { Mail, Smartphone, User } from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';
import toast from 'react-hot-toast';

import Modal from '@/components/overlay/Modal';
import { LabeledInputField } from '@/components/form/LabeledInputField';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProfileThunk } from '@/store/thunks';
import { isVietnamesePhone } from '@/utils/phone';

export type ProfileEditModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ProfileEditModal({ open, onClose }: ProfileEditModalProps): JSX.Element {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(s => s.user.profile);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open && profile) {
      setFullName(profile.fullName ?? '');
      setPhone(profile.phone?.trim() ?? '');
      setPhoneError(undefined);
    }
  }, [open, profile]);

  const onSave = async () => {
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (phone.trim() && !isVietnamesePhone(phone)) {
      setPhoneError('Phone number must be valid Vietnamese phone number');
      return;
    }
    setPhoneError(undefined);
    setBusy(true);
    try {
      await dispatch(
        updateProfileThunk({
          fullName: fullName.trim(),
          phone: phone.trim() || null,
        })
      ).unwrap();
      toast.success('Profile updated');
      onClose();
    } catch {
      toast.error('Could not update profile');
    } finally {
      setBusy(false);
    }
  };

  const email = profile?.email ?? '';

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Edit profile"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void onSave()} disabled={busy}>
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <LabeledInputField
          mode="readonly"
          id="edit-profile-email"
          label="Email"
          icon={Mail}
          value={email}
        />
        <LabeledInputField
          mode="edit"
          id="edit-profile-fullName"
          label="Full name"
          icon={User}
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <LabeledInputField
          mode="edit"
          id="edit-profile-phone"
          label="Phone"
          icon={Smartphone}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          error={phoneError}
        />
      </div>
    </Modal>
  );
}
