import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { ProjectForm } from "~/components/ProjectForm";
import { TopBar } from "~/components/TopBar";
import { getProject } from "~/queries/projects";

export default function Form() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects.project_form' });
  const { action = 'create', projectId } = useLocalSearchParams<{
    action?: string,
    projectId?: string
  }>();
  const db = useSQLiteContext();

  const { data: project, isPending } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getProject(db, projectId ? projectId : '-1'),
    enabled: action === 'update' && !!projectId
  });

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={action === 'update' && !!projectId ? t('update.Title') : t('create.Title')} />

      {(!isPending || action === 'create') ?
        <ProjectForm
          formType={action === 'update' && !!projectId ? 'update' : 'create'}
          projectId={projectId}
          project={project}
        />
        :
        <ActivityIndicator size="large" />
      }
    </PageWrapper>
  );
}