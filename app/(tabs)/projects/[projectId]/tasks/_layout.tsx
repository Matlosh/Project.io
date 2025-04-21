import { Stack } from "expo-router";

export default function TasksLayout() {
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