import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Input from '@/components/form/Input';
import { ROUTES } from '@/constants';
import { useAppDispatch } from '@/store/hooks';
import { createOrderThunk } from '@/store/thunks';

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [wardCode, setWardCode] = useState('');
  const [country, setCountry] = useState('Vietnam');
  const [notes, setNotes] = useState('');

  const submitOrder = async () => {
    const result = await dispatch(
      createOrderThunk({
        items: [], // Cart items resolved server-side
        paymentMethod: 'COD',
        shippingAddress: {
          recipientName: fullName,
          phone,
          address: addressLine1,
          city,
          province: state,
          zipCode,
        },
        note: notes || undefined,
      })
    );

    if (createOrderThunk.fulfilled.match(result)) {
      navigate(ROUTES.ORDERS);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout - React Fashion</title>
      </Helmet>
      <div className="max-w-2xl mx-auto">
        <Card title="Checkout">
          <div className="space-y-4">
            <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
            <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            <Input label="Address" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} />
            <Input label="City" value={city} onChange={e => setCity(e.target.value)} />
            <Input label="State / Province" value={state} onChange={e => setState(e.target.value)} />
            <Input label="Zip code" value={zipCode} onChange={e => setZipCode(e.target.value)} />
            <Input label="Address line 2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} />
            <Input label="District ID" value={districtId} onChange={e => setDistrictId(e.target.value)} />
            <Input label="Ward code" value={wardCode} onChange={e => setWardCode(e.target.value)} />
            <Input label="Country" value={country} onChange={e => setCountry(e.target.value)} />
            <Input label="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
            <Button className="w-full" onClick={submitOrder}>
              Place Order
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Checkout;
