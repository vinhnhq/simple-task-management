import { Fragment } from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Component {...pageProps} />
      <ToastContainer />
    </Fragment>
  );
}

export default MyApp;
