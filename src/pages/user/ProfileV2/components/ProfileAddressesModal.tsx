import { MapPin, User } from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';
import toast from 'react-hot-toast';

import Modal from '@/components/overlay/Modal';
import { LabeledInputField } from '@/components/form/LabeledInputField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createAddressThunk,
  deleteAddressThunk,
  setDefaultAddressThunk,
  updateAddressThunk,
} from '@/store/thunks';
import type { Address, AddressType, CreateAddressRequest } from '@/types/auth/auth';
import { isVietnamesePhone } from '@/utils/phone';

export type ProfileAddressesModalProps = {
  open: boolean;
  onClose: () => void;
};

const emptyForm = (): CreateAddressRequest => ({
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  district: '',
  ward: '',
  postalCode: '',
  country: 'Vietnam',
  isDefault: false,
  addressType: 'SHIPPING',
});

const toForm = (a: Address): CreateAddressRequest => ({
  fullName: a.fullName,
  phone: a.phone,
  addressLine1: a.addressLine1,
  addressLine2: a.addressLine2 ?? '',
  city: a.city,
  district: a.district ?? '',
  ward: a.ward ?? '',
  postalCode: a.postalCode ?? '',
  country: a.country ?? 'Vietnam',
  isDefault: a.isDefault,
  addressType: a.addressType ?? 'SHIPPING',
});

export function ProfileAddressesModal({
  open,
  onClose,
}: ProfileAddressesModalProps): JSX.Element {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(s => s.user.addresses);

  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateAddressRequest>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setView('list');
      setEditingId(null);
      setForm(emptyForm());
      setErrors({});
    }
  }, [open]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    setView('form');
  };

  const startEdit = (a: Address) => {
    setEditingId(a.id);
    setForm(toForm(a));
    setErrors({});
    setView('form');
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    else if (!isVietnamesePhone(form.phone)) {
      next.phone = 'Phone number must be valid Vietnamese phone number';
    }
    if (!form.addressLine1.trim()) next.addressLine1 = 'Address line is required';
    if (!form.city.trim()) next.city = 'City is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = (): CreateAddressRequest => ({
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    addressLine1: form.addressLine1.trim(),
    addressLine2: form.addressLine2?.trim() || undefined,
    city: form.city.trim(),
    district: form.district?.trim() || undefined,
    ward: form.ward?.trim() || undefined,
    postalCode: form.postalCode?.trim() || undefined,
    country: form.country?.trim() || undefined,
    isDefault: form.isDefault,
    addressType: form.addressType,
  });

  const onSave = async () => {
    if (!validate()) return;
    setBusy(true);
    try {
      const payload = buildPayload();
      if (editingId) {
        await dispatch(updateAddressThunk({ id: editingId, body: payload })).unwrap();
        toast.success('Address updated');
      } else {
        await dispatch(createAddressThunk(payload)).unwrap();
        toast.success('Address created');
      }
      setView('list');
      setEditingId(null);
      setForm(emptyForm());
    } catch {
      toast.error('Could not save address');
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm('Delete this address?')) return;
    setBusy(true);
    try {
      await dispatch(deleteAddressThunk(id)).unwrap();
      toast.success('Address deleted');
    } catch {
      toast.error('Could not delete address');
    } finally {
      setBusy(false);
    }
  };

  const onSetDefault = async (id: string) => {
    setBusy(true);
    try {
      await dispatch(setDefaultAddressThunk(id)).unwrap();
      toast.success('Default address updated');
    } catch {
      toast.error('Could not update default');
    } finally {
      setBusy(false);
    }
  };

  const footer =
    view === 'form' ? (
      <>
        <Button type="button" variant="outline" onClick={() => setView('list')} disabled={busy}>
          Back
        </Button>
        <Button type="button" onClick={() => void onSave()} disabled={busy}>
          Save
        </Button>
      </>
    ) : (
      <Button type="button" variant="outline" onClick={onClose}>
        Close
      </Button>
    );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={view === 'list' ? 'My addresses' : editingId ? 'Edit address' : 'Add address'}
      size="lg"
      footer={footer}
    >
      {view === 'list' ? (
        <div className="flex flex-col gap-4">
          <Button type="button" className="self-start" onClick={startCreate} disabled={busy}>
            Add address
          </Button>
          {addresses.length === 0 ? (
            <p className="text-body-regular text-muted-foreground">You have no saved addresses yet.</p>
          ) : (
            <ul className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
              {addresses.map(a => (
                <li
                  key={a.id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-gray-50 p-4 sm:flex-row sm:items-start sm:justify-between dark:bg-input/20"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-h6-semi text-gray-black dark:text-gray-white">{a.fullName}</p>
                      {a.isDefault ? (
                        <Badge variant="secondary" className="text-xs font-medium">
                          Default
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-body-regular text-muted-foreground">{a.phone}</p>
                    <p className="text-body-regular text-gray-800 dark:text-gray-200">
                      {a.addressLine1}
                      {a.addressLine2 ? `, ${a.addressLine2}` : ''}
                    </p>
                    <p className="text-caption-lg-regular text-muted-foreground">
                      {[a.ward, a.district, a.city, a.postalCode, a.country].filter(Boolean).join(', ')}
                    </p>
                    <p className="text-caption-sm-regular text-muted-foreground">
                      {a.addressType ?? 'SHIPPING'}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    {!a.isDefault ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => void onSetDefault(a.id)}
                      >
                        Set default
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => startEdit(a)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={busy}
                      onClick={() => void onDelete(a.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
          <LabeledInputField
            mode="edit"
            id="addr-fullName"
            label="Full name"
            icon={User}
            value={form.fullName}
            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
            error={errors.fullName}
          />
          <LabeledInputField
            mode="edit"
            id="addr-phone"
            label="Phone"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            error={errors.phone}
          />
          <LabeledInputField
            mode="edit"
            id="addr-line1"
            label="Address line 1"
            icon={MapPin}
            className="sm:col-span-2"
            value={form.addressLine1}
            onChange={e => setForm(f => ({ ...f, addressLine1: e.target.value }))}
            error={errors.addressLine1}
          />
          <LabeledInputField
            mode="edit"
            id="addr-line2"
            label="Address line 2 (optional)"
            className="sm:col-span-2"
            value={form.addressLine2 ?? ''}
            onChange={e => setForm(f => ({ ...f, addressLine2: e.target.value }))}
          />
          <LabeledInputField
            mode="edit"
            id="addr-city"
            label="City"
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            error={errors.city}
          />
          <LabeledInputField
            mode="edit"
            id="addr-district"
            label="District (optional)"
            value={form.district ?? ''}
            onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
          />
          <LabeledInputField
            mode="edit"
            id="addr-ward"
            label="Ward (optional)"
            value={form.ward ?? ''}
            onChange={e => setForm(f => ({ ...f, ward: e.target.value }))}
          />
          <LabeledInputField
            mode="edit"
            id="addr-postal"
            label="Postal code (optional)"
            value={form.postalCode ?? ''}
            onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
          />
          <LabeledInputField
            mode="edit"
            id="addr-country"
            label="Country"
            value={form.country ?? 'Vietnam'}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
          />
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="addr-type" className="text-caption-lg-regular text-gray-500">
              Address type
            </Label>
            <select
              id="addr-type"
              className="h-11 rounded-md border border-input bg-gray-50 px-3 text-body-regular text-gray-800 dark:bg-input/30"
              value={form.addressType}
              onChange={e =>
                setForm(f => ({ ...f, addressType: e.target.value as AddressType }))
              }
            >
              <option value="SHIPPING">SHIPPING</option>
              <option value="BILLING">BILLING</option>
              <option value="BOTH">BOTH</option>
            </select>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox
              id="addr-default"
              checked={form.isDefault}
              onCheckedChange={v => setForm(f => ({ ...f, isDefault: v === true }))}
            />
            <Label htmlFor="addr-default" className="text-body-regular font-normal">
              Set as default address
            </Label>
          </div>
        </div>
      )}
    </Modal>
  );
}
