import React from "react";
import { View } from "react-native";

export function PageWrapper({
  children
}: {
  children?: React.ReactNode
}) {
  return (
    <View className='flex-1 justify-start items-start gap-5 p-6 bg-secondary/30 pt-12'>
      {children && children}
    </View>
  );
}