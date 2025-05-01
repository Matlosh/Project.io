import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { Task } from "~/lib/database";
import { showToast } from "~/lib/utils";

export default function TaskPage() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  (async () => {
    try {
      const data = await db.getFirstAsync<Task>(`
        SELECT * FROM tasks WHERE id = ? 
      `, [taskId]);

      if(data === null) {
        showToast(`Can't find task's data.`);
        router.back();
      }

      setTask(data);
      setLoading(false);
    } catch(err) {
      showToast(`Can't fetch task's data.`);
      router.back();
    }
  })();

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={task !== null ? task.title : ''}
      />

      {loading ?
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" /> 
        </View>  
        :
        ''
      }
    </PageWrapper>
  );
}