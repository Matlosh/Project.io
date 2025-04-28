import { useLocalSearchParams } from "expo-router";
import { PageWrapper } from "~/components/PageWrapper";
import { TaskForm } from "~/components/TaskForm";
import { TopBar } from "~/components/TopBar";

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