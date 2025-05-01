import { useLocalSearchParams } from "expo-router";
import { PageWrapper } from "~/components/PageWrapper";
import { TaskForm } from "~/components/TaskForm";
import { TopBar } from "~/components/TopBar";

export default function Create() {
  const { projectId, categoryId } = useLocalSearchParams<{
      projectId: string,
      categoryId: string
    }>();

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header="Add new task"
      />
      <TaskForm
        categoryId={categoryId}
        projectId={projectId} />
    </PageWrapper>
  );
}