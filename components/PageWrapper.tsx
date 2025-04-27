import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="w-full bg-secondary">
      <View
        className={cn(
          'flex-1 justify-start items-start gap-5',
          className.length > 0 && className)}
        style={{
          paddingTop: isTopBarVisible ? 16 : insets.top + 16,
          paddingRight: insets.right + 24,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 24 
        }}>
        {children && children}
      </View>
    </ScrollView>
  );
}