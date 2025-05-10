import { useTranslation } from "react-i18next";
import { PageWrapper } from "~/components/PageWrapper";
import { ProjectForm } from "~/components/ProjectForm";
import { TopBar } from "~/components/TopBar";

export default function Create() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects.project_form.create' });

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={t('Title')} />
      <ProjectForm />      
    </PageWrapper>
  );
}