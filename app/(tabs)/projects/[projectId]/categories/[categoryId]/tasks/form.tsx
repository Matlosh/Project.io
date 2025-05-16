import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageWrapper } from "~/components/PageWrapper";
import { TaskForm } from "~/components/TaskForm";
import { TopBar } from "~/components/TopBar";

export default function Form() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects.task_form' });
  const { categoryId, action, taskId } = useLocalSearchParams<{
      categoryId: string,
      action?: string,
      taskId?: string
    }>();

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={action === 'update' && !!taskId ? t('update.Title') : t('create.Title')}
      />
      <TaskForm
        categoryId={categoryId}
        taskId={taskId}
        formType={action === 'update' && !!taskId ? 'update' : 'create'} />
    </PageWrapper>
  );
}