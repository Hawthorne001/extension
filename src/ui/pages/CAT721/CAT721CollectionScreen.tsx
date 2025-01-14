import { useEffect, useState } from 'react';

import { AddressCAT721CollectionSummary } from '@/shared/types';
import { Card, Column, Content, Header, Icon, Layout, Row, Text } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import CAT721Preview from '@/ui/components/CAT721Preview';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useCurrentKeyring } from '@/ui/state/keyrings/hooks';
import { colors } from '@/ui/theme/colors';
import { fontSizes } from '@/ui/theme/font';
import { copyToClipboard, shortAddress, useLocationState, useWallet } from '@/ui/utils';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';

import { useNavigate } from '../MainRoute';

interface LocationState {
  collectionId: string;
}

export default function CAT721CollectionScreen() {
  const { collectionId } = useLocationState<LocationState>();
  const [collectionSummary, setCollectionSummary] = useState<AddressCAT721CollectionSummary>({
    collectionInfo: {
      collectionId: '',
      name: '',
      symbol: '',
      description: '',
      max: '0',
      premine: '0'
    },
    localIds: []
  });

  const wallet = useWallet();

  const account = useCurrentAccount();

  const keyring = useCurrentKeyring();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wallet.getAddressCAT721CollectionSummary(account.address, collectionId).then((collectionSummary) => {
      setCollectionSummary(collectionSummary);
      setLoading(false);
    });
  }, []);

  const navigate = useNavigate();

  if (loading) {
    return (
      <Layout>
        <Content itemsCenter justifyCenter>
          <Icon size={fontSizes.xxxl} color="gold">
            <LoadingOutlined />
          </Icon>
        </Content>
      </Layout>
    );
  }

  if (!collectionSummary || !collectionSummary.collectionInfo) {
    return (
      <Layout>
        <Header
          onBack={() => {
            window.history.go(-1);
          }}
        />
        <Content itemsCenter justifyCenter>
          <Text text="Collection not found" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        onBack={() => {
          window.history.go(-1);
        }}
      />
      {collectionSummary && (
        <Content>
          <Row py="xl" pb="md">
            <Text text={collectionSummary.collectionInfo.name} preset="title" textCenter size="xl" color="gold" />
          </Row>

          <Card style={{ borderRadius: 15 }}>
            <Column fullX my="sm">
              <Section title="Collection Id" value={collectionSummary.collectionInfo.collectionId} showCopyIcon />
              <Section title="Collection" value={collectionSummary.collectionInfo.symbol} />
              <Section title="Max supply" value={collectionSummary.collectionInfo.max} />
              <Section title="Premine" value={collectionSummary.collectionInfo.premine} />
              {collectionSummary.collectionInfo.description ? (
                <Row
                  style={{
                    backgroundColor: colors.border,
                    height: 1
                  }}></Row>
              ) : null}
              {collectionSummary.collectionInfo.description ? (
                <Row>
                  <Text text={collectionSummary.collectionInfo.description} preset="sub" />
                </Row>
              ) : null}
            </Column>
          </Card>

          {collectionSummary.localIds.length > 0 && (
            <Row style={{ flexWrap: 'wrap' }} justifyBetween>
              {collectionSummary.localIds.map((localId, index) => (
                <CAT721Preview
                  key={localId}
                  preset="medium"
                  collectionId={collectionSummary.collectionInfo.collectionId}
                  localId={localId}
                  onClick={() => {
                    navigate('CAT721NFTScreen', {
                      collectionInfo: collectionSummary.collectionInfo,
                      localId
                    });
                  }}
                />
              ))}
            </Row>
          )}
        </Content>
      )}
    </Layout>
  );
}

export function Section({
  value,
  title,
  link,
  showCopyIcon
}: {
  value: string | number;
  title: string;
  link?: string;
  showCopyIcon?: boolean;
}) {
  const tools = useTools();
  let displayText = value.toString();
  if (value && typeof value === 'string' && value.length > 20) {
    displayText = shortAddress(value, 10);
  }
  return (
    <Row justifyBetween>
      <Text text={title} preset="sub" />
      <Row
        onClick={() => {
          if (link) {
            window.open(link);
          } else {
            copyToClipboard(value).then(() => {
              tools.toastSuccess('Copied');
            });
          }
        }}>
        <Text text={displayText} preset={link ? 'link' : 'regular'} size="xs" wrap />
        {showCopyIcon && <CopyOutlined style={{ color: '#888', fontSize: 14 }} />}
      </Row>
    </Row>
  );
}