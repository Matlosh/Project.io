import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { CategoryForm } from "~/components/CategoryForm";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { getCategory } from "~/queries/categories";

export default function Form() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects.category_form' });
  const { projectId, action = 'create', categoryId } = useLocalSearchParams<{
    projectId: string,
    action?: string,
    categoryId?: string 
  }>();
  const db = useSQLiteContext();

  const { data: category, isPending } = useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => getCategory(db, categoryId ? categoryId : '-1'),
    enabled: !!categoryId && action === 'update' 
  });

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={action === 'update' ? t('update.Title') : t('create.Title')} />

      {(!isPending || action === 'create') ?
        <CategoryForm
          projectId={projectId}
          categoryId={categoryId}
          category={category}
          formType={action === 'update' && !!categoryId ? 'update' : 'create'} />
        :
        <ActivityIndicator size="large" />
      }
    </PageWrapper>
  );
}