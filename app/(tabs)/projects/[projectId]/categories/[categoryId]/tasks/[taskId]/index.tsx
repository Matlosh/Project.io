import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useMemo, useState } from "react";
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
import { Separator } from "~/components/ui/separator";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTodo, getTodos, markTodoStatus } from "~/queries/todos";
import { getTask } from "~/queries/tasks";
import { z } from "zod";

function TodoEntry({
  todo,
  onDelete
}: {
  todo: Todo,
  onDelete: (todoId: number) => void
}) {
  const { t: tErrors } = useTranslation('form_errors');

  const db = useSQLiteContext();
  const { colorOptions } = useThemeColor();

  const queryClient = useQueryClient();

  const markAsDoneSchema = useMemo(() => z.object({
    taskId: z.string(),
    checked: z.boolean(),
    id: z.string()
  }), []);

  const markAsDoneMutation = useMutation({
    mutationFn: (data: z.infer<typeof markAsDoneSchema>) => markTodoStatus(db, data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });      
      queryClient.invalidateQueries({ queryKey: ['todosInfo'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      showToast(tErrors('Operation failed. Please try again.'));
    }
  });

  const onTodoDoneChange = (checked: boolean) => {
    const data = markAsDoneSchema.safeParse({
      taskId: todo.task_id.toString(),
      checked: checked,
      id: todo.id.toString()
    });

    if(!data.success) {
      showToast(tErrors('Something went wrong. Please try again.'));
      return;
    }

    markAsDoneMutation.mutate(data.data);
  };

  return (
    <View className="flex flex-row gap-2">
      <Checkbox
        checked={markAsDoneMutation.variables ? !!markAsDoneMutation.variables.checked : !!todo.done}
        onCheckedChange={onTodoDoneChange}
      />
      <View className="flex flex-col">
        <Label>{todo.title}</Label>
      </View>
      <Pressable
        onPress={() => onDelete(todo.id)}
        className="ml-auto mb-auto">
        <View className="w-6 h-6 bg-red-500 flex items-center justify-center rounded-md">
          <Trash2
            width={14}
            color={colorOptions.background} />   
        </View>      
      </Pressable>
    </View>
  );
}

export default function TaskPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects' });
  const { t: tErrors } = useTranslation('translation', { keyPrefix: 'errors' });

  const { projectId, categoryId, taskId } = useLocalSearchParams<{
    projectId: string,
    categoryId: string,
    taskId: string
  }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const { colorOptions } = useThemeColor();

  const queryClient = useQueryClient();

  const { data: task, isLoading: isTaskLoading } = useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => getTask(db, taskId)
  });

  const { data: todos, isLoading: areTodosLoading } = useQuery({
    queryKey: ['todos', taskId],
    queryFn: () => getTodos(db, taskId)
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (todoId: string) => deleteTodo(db, todoId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={task ? task.title : ''}
      />

      {isTaskLoading || areTodosLoading ?
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" /> 
        </View>  
        :
        <View className="w-full flex flex-col gap-4">
          {todos &&
            <View className="flex flex-col gap-2">
              {todos.filter(todo => todo.id.toString() !== deleteTodoMutation.variables).map(todo => (
                <TodoEntry
                  key={todo.id}
                  todo={todo}
                  onDelete={() => deleteTodoMutation.mutate(todo.id.toString())}
                />
              ))} 
            </View> 
          }
          
          <TodoForm
            formType="create"
            taskId={taskId}
          />

          {task ?
            <>
              {task.description.trim().length > 0 ?
                <View className="flex flex-col gap-4">
                  <Separator
                    orientation="horizontal"
                    className="mt-4 mb-2"
                    style={{backgroundColor: colorOptions.text}} />
                  <Text className="text-lg font-bold">{t('Description')}</Text>
                  <Text>{task.description}</Text>
                </View>
                :
                null
              }

              <Separator
                orientation="horizontal"
                className="mt-4 mb-2"
                style={{backgroundColor: colorOptions.text}} />

              <Text className="text-lg font-bold">{t('Information about this task')}</Text>

              <View className="flex flex-col gap-2">
                <View className="flex flex-row gap-2 flex-wrap">
                  <Text className="font-bold">{t('Full title')}:</Text>
                  <Text>{task.title}</Text>
                </View> 

                {task.is_until ?
                  <View className="flex flex-row gap-2">
                    <Text className="font-bold">{t('Until')}:</Text>
                    <Text>{format(new Date(task.until * 1000), 'do LLL yyyy, HH:mm')}</Text>
                  </View> 
                  :
                  null
                }
              </View> 
            </> 
            :
            <Text>{t('Task not found')}</Text>
          }
        </View>
      }
    </PageWrapper>
  );
}