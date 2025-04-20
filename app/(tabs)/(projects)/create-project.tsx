import { PageWrapper } from "~/components/PageWrapper";
import { ProjectForm } from "~/components/ProjectForm";

export default function CreateProject() {
  return (
    <PageWrapper isTopBarVisible={true}>
      <ProjectForm />      
    </PageWrapper>
  );
}