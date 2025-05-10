import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { CategoryForm } from "~/components/CategoryForm";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";

export default function Create() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects.category_form.create' });
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={t('Title')} />
      <CategoryForm projectId={projectId} />
    </PageWrapper>
  );
}