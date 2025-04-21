import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageWrapper } from '~/components/PageWrapper';
import { Text } from '~/components/ui/text';

export default function Screen() {
  return (
    <PageWrapper>
      <Text className="text-xl font-bold">Home</Text>
    </PageWrapper>
  );
}
