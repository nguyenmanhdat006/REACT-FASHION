import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { ROUTES } from '@/constants';
import { useAppDispatch } from '@/store/hooks';
import { createOrderThunk } from '@/store/thunks';
import { PaymentMethod } from '@/types/order';

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('Vietnam');

  const submitOrder = async () => {
    const result = await dispatch(
      createOrderThunk({
        paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
        shippingAddress: {
          fullName,
          phone,
          addressLine1,
          city,
          state,
          zipCode,
          country,
        },
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
            <Input label="State" value={state} onChange={e => setState(e.target.value)} />
            <Input label="Zip code" value={zipCode} onChange={e => setZipCode(e.target.value)} />
            <Input label="Country" value={country} onChange={e => setCountry(e.target.value)} />
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
