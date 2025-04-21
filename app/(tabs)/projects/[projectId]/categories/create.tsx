import { useLocalSearchParams } from "expo-router";
import { CategoryForm } from "~/components/CategoryForm";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";

export default function Create() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header="Add new category" />
      <CategoryForm projectId={projectId} />
    </PageWrapper>
  );
}