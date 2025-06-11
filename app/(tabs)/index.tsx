import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { openDatabaseSync } from 'expo-sqlite';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '~/components/PageWrapper';
import { Text } from '~/components/ui/text';

const db = openDatabaseSync("project_io.db");

export default function Screen() {
  const { t } = useTranslation('translation', { keyPrefix: 'menu' });

  // Used to enable the Drizzle Studio to inspect the SQLite database easily
  useDrizzleStudio(db);

  return (
    <PageWrapper>
      <Text className="text-xl font-bold">{t('Home')}</Text>
    </PageWrapper>
  );
}
