import { useCallback } from 'react';
import {
  openLink,
  LinkLogLevel,
  LinkIOSPresentationStyle,
  usePlaidEmitter,
} from 'react-native-plaid-link-sdk';

import { exchangeToken } from '../../utils/plaidApi';
import { ColorButton } from '../ColorButton';

export const PlaidLink = (props) => {
  usePlaidEmitter((event) => {
    console.log('=== plaid event', event);
  });

  const onSuccess = useCallback((data) => {
    const { publicToken } = data;
    exchangeToken(publicToken, props.user.id)
      .then((data) => {
        return data;
      })
      .catch((e) => console.error('Token exchange failed', e));
  }, []);

  const onExit = useCallback((data) => {}, []);
  const onEvent = useCallback((data) => {}, []);

  const onPress = useCallback(() => {
    openLink({
      tokenConfig: {
        token: props.linkToken,
        logLevel: LinkLogLevel.ERROR,
        noLoadingState: false,
      },
      onSuccess,
      onExit,
      onEvent,
      iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    });
  }, [props.linkToken]);

  return <ColorButton inverted onPress={onPress} text="Add Account" />;
};
