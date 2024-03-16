import { useCallback, useEffect, useState } from 'react';
import {
  openLink,
  LinkLogLevel,
  LinkIOSPresentationStyle,
  usePlaidEmitter,
} from 'react-native-plaid-link-sdk';

import { createLinkToken, exchangeToken } from '../../utils/plaidApi';
import { ColorButton } from '../ColorButton';

export const PlaidLink = (props) => {
  const [linkToken, setLinkToken] = useState(null);
  usePlaidEmitter((event) => {});

  useEffect(() => {
    createLinkToken().then((data) => {
      setLinkToken(data.link_token);
    });
  }, []);

  const onSuccess = useCallback(async (data) => {
    const { publicToken } = data;
    const updatedUser = await exchangeToken(publicToken, props.user.id);
    props.onLinkSuccess(updatedUser);
  }, []);

  const onExit = useCallback((data) => {}, []);
  const onEvent = useCallback((data) => {}, []);

  const onPress = useCallback(() => {
    openLink({
      tokenConfig: {
        token: linkToken,
        logLevel: LinkLogLevel.ERROR,
        noLoadingState: false,
      },
      onSuccess,
      onExit,
      onEvent,
      iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    });
  }, [linkToken]);

  return (
    <ColorButton
      inverted
      colorName="green"
      onPress={onPress}
      text="Add Account"
    />
  );
};
