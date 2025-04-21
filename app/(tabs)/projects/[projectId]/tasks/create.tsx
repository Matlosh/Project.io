import { PageWrapper } from "~/components/PageWrapper";
import { TaskForm } from "~/components/TaskForm";
import { TopBar } from "~/components/TopBar";
import { Text } from "~/components/ui/text";

export default function Create() {
  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header="Add new task"
      />
    </PageWrapper>
  );
}