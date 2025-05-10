import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '~/components/PageWrapper';
import { Text } from '~/components/ui/text';

export default function Screen() {
  const { t } = useTranslation('translation', { keyPrefix: 'menu' });

  return (
    <PageWrapper>
      <Text className="text-xl font-bold">{t('Home')}</Text>
    </PageWrapper>
  );
}
