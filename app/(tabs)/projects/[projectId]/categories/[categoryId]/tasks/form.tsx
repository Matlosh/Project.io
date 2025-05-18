import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TaskForm } from "~/components/TaskForm";
import { TopBar } from "~/components/TopBar";
import { getTask } from "~/queries/tasks";

export default function Form() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects.task_form' });
  const { categoryId, action = 'create', taskId } = useLocalSearchParams<{
      categoryId: string,
      action?: string,
      taskId?: string
    }>();
  const db = useSQLiteContext();

  const { data: task, isPending } = useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => getTask(db, taskId ? taskId : '-1'),
    enabled: !!taskId && action === 'update'
  });

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={action === 'update' && !!taskId ? t('update.Title') : t('create.Title')}
      />

      {(!isPending || action === 'create') ?
        <TaskForm
          categoryId={categoryId}
          taskId={taskId}
          formType={action === 'update' && !!taskId ? 'update' : 'create'}
          task={task} />
        :
        <ActivityIndicator size="large" />
      }
    </PageWrapper>
  );
}