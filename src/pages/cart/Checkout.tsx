import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Input from '@/components/form/Input';
import { ROUTES } from '@/constants';
import { useAppDispatch } from '@/store/hooks';
import { createOrderThunk } from '@/store/thunks';
import { PaymentMethod } from '@/types/order/order';

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
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
          district,
          postalCode,
          country,
          addressType: 'SHIPPING',
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
            <Input label="District" value={district} onChange={e => setDistrict(e.target.value)} />
            <Input label="Postal code" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
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
