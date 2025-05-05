import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { PageWrapper } from "~/components/PageWrapper";
import { TaskForm } from "~/components/TaskForm";
import { TopBar } from "~/components/TopBar";

export default function Form() {
  const { projectId, categoryId, action, taskId } = useLocalSearchParams<{
      projectId: string,
      categoryId: string,
      action?: string,
      taskId?: string
    }>();

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={action === 'update' && !!taskId ? "Edit task" : "Add new task"}
      />
      <TaskForm
        categoryId={categoryId}
        projectId={projectId}
        taskId={taskId}
        formType={action === 'update' && !!taskId ? 'update' : 'create'} />
    </PageWrapper>
  );
}