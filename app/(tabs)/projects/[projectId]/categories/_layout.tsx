import { Stack } from "expo-router";

export default function CategoriesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='create'
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}