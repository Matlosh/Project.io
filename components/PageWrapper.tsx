import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";

export function PageWrapper({
  children,
  isTopBarVisible = false,
  className = ''
}: {
  children?: React.ReactNode,
  isTopBarVisible?: boolean,
  className?: string
}) {
  return (
    <View className={cn(
      'flex-1 justify-start items-start gap-5 p-6 bg-secondary/30',
      isTopBarVisible ? 'pt-4' : 'pt-12',
      className.length > 0 && className)}>
      {children && children}
    </View>
  );
}