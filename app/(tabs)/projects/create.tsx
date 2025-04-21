import { PageWrapper } from "~/components/PageWrapper";
import { ProjectForm } from "~/components/ProjectForm";
import { TopBar } from "~/components/TopBar";

export default function Create() {
  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header="Add new project" />
      <ProjectForm />      
    </PageWrapper>
  );
}