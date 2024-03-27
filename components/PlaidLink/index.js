import { useCallback, useEffect, useState } from 'react';
import {
  openLink,
  LinkLogLevel,
  LinkIOSPresentationStyle,
  usePlaidEmitter,
} from 'react-native-plaid-link-sdk';

import { useUserContext } from '../../context/User';
import { createLinkToken, exchangeToken } from '../../utils/plaidApi';
import { ColorButton } from '../ColorButton';

export const PlaidLink = (props) => {
  const [linkToken, setLinkToken] = useState(null);
  const {
    state: { user },
  } = useUserContext();
  usePlaidEmitter((event) => {});

  useEffect(() => {
    createLinkToken(user.id).then((data) => {
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
        logLevel: LinkLogLevel.DEBUG,
        noLoadingState: false,
      },
      onSuccess,
      onExit,
      onEvent,
      iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    });
  }, [linkToken]);

  return (
    <ColorButton inverted size="slim" onPress={onPress} text="Add Account" />
  );
};
