import { useLocalSearchParams } from "expo-router";
import { PageWrapper } from "~/components/PageWrapper";
import { TaskForm } from "~/components/TaskForm";
import { TopBar } from "~/components/TopBar";
import { Text } from "~/components/ui/text";

export default function Create() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header="Add new task"
      />
      <TaskForm projectId={projectId} />
    </PageWrapper>
  );
}