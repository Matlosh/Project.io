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
 
type TodosInfo = {
  available: number,
  completed: number
};

function TodoEntry({
  todo
}: {
  todo: Todo
}) {
  const [checked, setChecked] = useState(!!todo.done);
  const db = useSQLiteContext();

  const onCheckedChange = (checked: boolean) => {
    setChecked(checked);

    (async () => {
      try {
        await db.runAsync(`
          UPDATE todos SET done = ? WHERE task_id = ?
        `, [+checked, todo.task_id]);
      } catch(err) {
        showToast(`Failed to change todo's status.`)
      }
    })();
  };

  return (
    <View className="flex flex-row gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </View>
  );
}

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

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return (
    <Pressable
      onLongPress={() => console.log('long press...?')}
      onPress={() => router.push(`/projects/${projectId}/categories/${categoryId}/tasks/${task.id}`)}
      className="w-full">
      <Card className="w-full">
        <CardHeader>
          <Text className="text-lg font-bold">{task.title}</Text>
          <CardDescription>Completed: {todosInfo.completed}/{todosInfo.available} ({todosInfo.available > 0 ? todosInfo.completed * 100 / todosInfo.available : 100}%)</CardDescription>
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

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={category !== null ? category.title : ''}
        headerRight={
          <DropdownMenu>
            <DropdownMenuTrigger>
              <CirclePlus
                color={colorOptions.text}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              insets={{
                top: 8,
                right: 24,
                bottom: 8,
                left: 24
              }}
              className="mt-4">
              <DropdownMenuItem
                onPress={() => router.push(`/projects/${projectId}/categories/${categoryId}/tasks/create`)}>
                <Text>Add new todo</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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