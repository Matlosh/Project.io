import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Text } from "~/components/ui/text";
import { Category, Task, Todo } from "~/lib/database";
import { cn, showToast } from "~/lib/utils";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Checkbox } from "~/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { CirclePlus } from "~/lib/icons/CirclePlus";
import { useThemeColor } from "~/hooks/useThemeColor";
import { format } from "date-fns";
import { useDynamicReload } from "~/hooks/useDynamicReload";
import { UpdateEntry } from "~/components/providers/UpdateProvider";
 
type TodosInfo = {
  available: number,
  completed: number
};

function TaskEntry({
  task,
  projectId,
  categoryId
}: {
  task: Task,
  projectId: string,
  categoryId: string
}) {
  const db = useSQLiteContext();
  const router = useRouter();
  const [todosInfo, setTodosInfo] = useState<TodosInfo>({
    available: 0,
    completed: 0
  });
  const [untilDate, setUntilDate] = useState<Date>(new Date(task.until * 1000)); 

  useEffect(() => {
    reloadTodosInfo(); 
  }, []);

  useDynamicReload((entries: UpdateEntry[]) => {
    const todoEntry = entries.find(entry => entry.key === 'todos');
    const taskEntry = entries.find(entry => entry.key === 'tasks');

    if(todoEntry && taskEntry && taskEntry.values[0] === task.id.toString()) {
      reloadTodosInfo(); 
    }
  }, ['todos', 'tasks']);

  const reloadTodosInfo = async () => {
    try {
      const data = await db.getFirstAsync<TodosInfo>(`
        SELECT
        (
          SELECT COUNT(id) FROM todos WHERE task_id = ?
        ) AS available,
        (
          SELECT COUNT(id) FROM todos WHERE task_id = ? AND done = 1
        ) AS completed; 
      `, [task.id, task.id]); 

      if(data !== null) {
        setTodosInfo(data);
      } else {
        showToast(`Failed to fetch task's todo status.`);
      }
    } catch(err) {
      showToast(`Could not fetch "${task.title}"'s data.`);
    }
  };

  return (
    <Pressable
      onLongPress={() => console.log('long press...?')}
      onPress={() => router.push(`/projects/${projectId}/categories/${categoryId}/tasks/${task.id}`)}
      className="w-full">
      <Card className={cn("w-full", task.important && "border-l-[1px] border-red-500")}>
        <CardHeader>
          <Text className="text-lg font-bold">{task.title}</Text>
          <CardDescription>Completed: {todosInfo.completed}/{todosInfo.available} ({todosInfo.available > 0 ? (todosInfo.completed * 100 / todosInfo.available).toFixed(2) : 100}%)</CardDescription>
          {task.is_until ? 
            <CardDescription
              className={cn(untilDate < new Date() && "text-red-500")}>Until: {format(untilDate, 'do LLL yyyy, HH:mm')}</CardDescription>
            :
            null
          }
          {task.finished ?
            <CardDescription className="text-red-500">Finished</CardDescription>
            :
            null
          }
          {todosInfo.available === todosInfo.completed || task.finished ?
            <CardDescription
              className="text-green-500">Finished</CardDescription>
            :
            null
          }
        </CardHeader>
      </Card>
    </Pressable>
  );
}

export default function CategoryPage() {
  const { projectId, categoryId } = useLocalSearchParams<{
    projectId: string,
    categoryId: string
  }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const [category, setCategory] = useState<Category | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { colorOptions } = useThemeColor();

  useEffect(() => {
    (async () => {
      try {
        const data = await db.getFirstAsync<Category>(`
          SELECT * FROM categories WHERE id = ?
        `, categoryId);

        if(data === null) {
          showToast(`Could not find matching category.`);
          router.back();
        }

        setCategory(data);
      } catch(err) {
        showToast(`Could not fetch category's data.`);
        router.back();
      }
    })();
  }, []);

  useDynamicReload((entries: UpdateEntry[]) => {
    const taskEntry = entries.find(entry => entry.key === 'tasks');

    if(taskEntry) {
      reloadTask(taskEntry.values[0]);            
    }
  }, ['tasks']);

  useEffect(() => {
    if(category !== null) {
      (async () => {
        try {
          const data = await db.getAllAsync<Task>(`
            SELECT * FROM tasks WHERE category_id = ? ORDER BY finished DESC
          `, category.id);

          setTasks(data);
          setLoading(false);
        } catch(err) {
          showToast(`Could not fetch category's tasks.`);
          router.back();
        }
      })();
    }
  }, [category]);

  const reloadTask = async (taskId: string) => {
    try {
      const data = await db.getFirstAsync<Task>(`
        SELECT * FROM tasks WHERE id = ?
      `, [taskId]);

      if(data) {
        setTasks([
          ...(tasks.filter(task => task.id.toString() !== taskId)),
          data
        ]);
      }
    } catch(err) {
      showToast(`Could not reload task.`);
    }
  };

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={category !== null ? category.title : ''}
        headerRight={
          <CirclePlus
            onPress={() => router.push(`/projects/${projectId}/categories/${categoryId}/tasks/create`)}
            color={colorOptions.text}/>
        }
      />

      {loading ?
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" /> 
        </View>  
        :
        <>
          {tasks.map(task => (
            <TaskEntry
              key={task.id}
              task={task}
              projectId={projectId}
              categoryId={categoryId}
            />            
          ))}
        </>
      }
    </PageWrapper>
  );
}