import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Task, Todo } from "~/lib/database";
import { showToast } from "~/lib/utils";
import { CirclePlus } from "~/lib/icons/CirclePlus";
import { useThemeColor } from "~/hooks/useThemeColor";
import { Text } from "~/components/ui/text";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { TodoForm } from "~/components/TodoForm";
import { Trash2 } from "~/lib/icons/Trash2";
import { useDynamicReload } from "~/hooks/useDynamicReload";
import { Separator } from "~/components/ui/separator";
import { format } from "date-fns";

function TodoEntry({
  todo,
  onDelete
}: {
  todo: Todo,
  onDelete: (todoId: number) => void
}) {
  const [checked, setChecked] = useState(!!todo.done);
  const db = useSQLiteContext();
  const { colorOptions } = useThemeColor();
  const { sendDynamicReload } = useDynamicReload();

  const onTodoDoneChange = (checked: boolean) => {
    setChecked(checked);

    (async () => {
      try {
        await db.runAsync(`
          UPDATE todos SET done = ? WHERE id = ?;
          UPDATE tasks SET finished =
            ((SELECT COUNT(id) FROM todos WHERE done = 0) = 0)
            WHERE id = ?;
        `, [+checked, todo.id, todo.task_id, todo.task_id]);

        sendDynamicReload([
          {
            key: 'todos',
            state: 'update',
            values: [todo.id.toString()]
          },
          {
            key: 'tasks',
            state: 'update',
            values: [todo.task_id.toString()]
          }
        ]);
      } catch(err) {
        showToast(`Failed to change todo's status.`)
      }
    })();
  };

  const onTodoDelete = () => {
    onDelete(todo.id);
    
    (async () => {
      try {
        await db.runAsync(`
          DELETE FROM todos WHERE id = ?
        `, [todo.id]);

        sendDynamicReload([
          {
            key: 'todos',
            state: 'delete',
            values: [todo.id.toString()]
          },
          {
            key: 'tasks',
            state: 'update',
            values: [todo.task_id.toString()]
          }
        ]);
      } catch(err) {
        showToast(`Failed to remove todo.`);
      }
    })();
  };

  return (
    <View className="flex flex-row gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={onTodoDoneChange}
      />
      <View className="flex flex-col">
        <Label>{todo.title}</Label>
      </View>
      <Pressable
        onPress={() => onTodoDelete()}
        className="ml-auto mb-auto">
        <View className="w-6 h-6 bg-red-500 flex items-center justify-center rounded-md">
          <Trash2
            width={14}
            color={colorOptions.text} />   
        </View>      
      </Pressable>
    </View>
  );
}

export default function TaskPage() {
  const { projectId, categoryId, taskId } = useLocalSearchParams<{
    projectId: string,
    categoryId: string,
    taskId: string
  }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const { colorOptions } = useThemeColor();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);  

  useEffect(() => {
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

        const todosData = await db.getAllAsync<Todo>(`
          SELECT * FROM todos WHERE task_id = ?
        `, taskId); 

        setTodos(todosData);
        setLoading(false);
      } catch(err) {
        showToast(`Can't fetch task's data.`);
        router.back();
      }
    })();
  }, []);

  const onTodoSave = (todo: Todo) => {
    setTodos([
      ...(todos.filter(el => el.id !== todo.id)),
      todo
    ]);
  };

  const onTodoDelete = (todoId: number) => {
    setTodos([...(todos.filter(todo => todo.id !== todoId))]);
  }

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={task !== null ? task.title : ''}
      />

      {loading || task === null ?
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" /> 
        </View>  
        :
        <View className="w-full flex flex-col gap-4">
          {todos.map(todo => (
            <TodoEntry
              key={todo.id}
              todo={todo}
              onDelete={onTodoDelete}
            />
          ))}

          <TodoForm
            formType="create"
            taskId={taskId}
            onSave={onTodoSave}
          />

          {task.description.trim().length > 0 ?
            <View className="flex flex-col gap-4">
              <Separator
                orientation="horizontal"
                className="mt-4 mb-2"
                style={{backgroundColor: colorOptions.text}} />
              <Text className="text-lg font-bold">Description</Text>
              <Text>{task.description}</Text>
            </View>
            :
            null
          }

          <Separator
            orientation="horizontal"
            className="mt-4 mb-2"
            style={{backgroundColor: colorOptions.text}} />

          <Text className="text-lg font-bold">Information about this task</Text>

          <View className="flex flex-col gap-2">
            <View className="flex flex-row gap-2 flex-wrap">
              <Text className="font-bold">Full title:</Text>
              <Text>{task.title}</Text>
            </View> 

            {task.is_until ?
              <View className="flex flex-row gap-2">
                <Text className="font-bold">Until:</Text>
                <Text>{format(new Date(task.until * 1000), 'do LLL yyyy, HH:mm')}</Text>
              </View> 
              :
              null
            }
          </View>
        </View>
      }
    </PageWrapper>
  );
}