import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfileThunk, updateProfileThunk } from '@/store/thunks';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector(state => state.user);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    void dispatch(fetchProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const onSave = async () => {
    await dispatch(updateProfileThunk({ fullName, phone }));
  };

  return (
    <>
      <Helmet>
        <title>Profile - React Fashion</title>
      </Helmet>
      <div className="max-w-2xl mx-auto">
        <Card title="My Profile">
          <div className="space-y-4">
            <Input label="Email" value={profile?.email || ''} disabled />
            <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
            <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            <Button onClick={onSave}>Save</Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Profile;
