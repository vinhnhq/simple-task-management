import { Fragment } from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Component {...pageProps} />
      <ToastContainer />

      <style jsx global>{`
        .mr-1 {
          margin-right: 0.5em;
        }

        .mb-1 {
          margin-bottom: 0.5em;
        }
      `}</style>
    </Fragment>
  );
}

export default MyApp;
