import React from 'react';
import type { RouteObject } from 'react-router-dom';

const LoginV2 = React.lazy(() => import('@/pages/authV2/LoginV2/index'));
const SignUpV2 = React.lazy(() => import('@/pages/authV2/SignUpV2/index'));
const ForgotPasswordV2 = React.lazy(() => import('@/pages/authV2/ForgotPasswordV2/index'));
const ForgotPasswordSentV2 = React.lazy(() => import('@/pages/authV2/ForgotPasswordSentV2/index'));

export const authV2Routes: RouteObject[] = [
  { path: 'login', element: <LoginV2 /> },
  { path: 'signup', element: <SignUpV2 /> },
  { path: 'forgot-password', element: <ForgotPasswordV2 /> },
  { path: 'forgot-password/sent', element: <ForgotPasswordSentV2 /> },
];
