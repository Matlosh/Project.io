import { Stack } from "expo-router";

export default function ProjectsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='form'
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='[projectId]'
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}