import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, View } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Category, Task, Todo } from "~/lib/database";
import { cn, showToast } from "~/lib/utils";
import { CirclePlus } from "~/lib/icons/CirclePlus";
import { Clock9 } from "~/lib/icons/Clock9";
import { CheckCheck } from "~/lib/icons/CheckCheck";
import { Check } from "~/lib/icons/Check";
import { useThemeColor } from "~/hooks/useThemeColor";
import { format } from "date-fns";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { deleteTask, getActiveTasks, getFinishedTasks, getTasks } from "~/queries/tasks";
import { getCategory } from "~/queries/categories";
import { getTodosInfo, TodosInfo } from "~/queries/todos";
import { Separator } from "~/components/ui/separator";
import { ConfirmationDialog } from "~/components/ui/confirmation-dialog";
import { ChoiceDialog } from "~/components/ui/choice-dialog";

function TaskEntry({
  task,
  projectId,
  categoryId,
  onDelete
}: {
  task: Task,
  projectId: string,
  categoryId: string,
  onDelete: (taskId: string) => void
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects' });
  const { t: tModals } = useTranslation('translation', { keyPrefix: 'modals' });
  const db = useSQLiteContext();
  const router = useRouter();
  const [untilDate, setUntilDate] = useState<Date>(new Date(task.until * 1000)); 
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const { colorOptions } = useThemeColor();

  const { data: todosInfo, isPending } = useSuspenseQuery({
    queryKey: ['todos', 'todosInfo', task.id],
    queryFn: () => getTodosInfo(db, task.id.toString())
  });

  return (
    <>
      {!isPending && todosInfo &&
        <View className="w-full">
          <Pressable
            onLongPress={() => setModalVisible(true)}
            onPress={() => router.push(`/projects/${projectId}/categories/${categoryId}/tasks/${task.id}`)}
            className="w-full">
            <Card className={cn("w-full", task.important && "border-l-[1px] border-red-500")}>
              <CardHeader>
                <Text className="text-lg font-bold">{task.title}</Text>
                <CardDescription>
                  <View className="flex flex-row items-center gap-1">
                    <CheckCheck
                      size={12}
                      color={colorOptions.text}
                    />

                    <Text className="text-sm">
                      {todosInfo.completed}/{todosInfo.available} ({todosInfo.available > 0 ? (todosInfo.completed * 100 / todosInfo.available).toFixed(2) : 100}%)
                    </Text>
                  </View>
                </CardDescription>
                {task.is_until ? 
                  <CardDescription
                    className={cn(
                      untilDate < new Date() && "text-red-500"
                    )}>
                      <View className="flex flex-row items-center gap-1 text-blue-500">
                        <Clock9
                          size={12}
                          className={cn(
                            untilDate < new Date() && "text-red-500"
                          )}
                          color={colorOptions.text} />

                        <Text className={cn(
                            "text-sm",
                            untilDate < new Date() && "text-red-500"
                          )}>
                          {format(untilDate, 'LLL do, HH:mm')}
                        </Text>
                      </View>
                    </CardDescription>
                  :
                  null
                }
                {task.finished ?
                  <CardDescription>
                      <View className="flex flex-row items-center gap-1">
                        <Check
                        size={12}
                        className="text-green-500"
                        />

                      <Text className="text-green-500 text-sm">
                        {t('Finished')}
                      </Text>
                    </View>
                  </CardDescription>
                  :
                  null
                }
              </CardHeader>
            </Card>
          </Pressable>

          <ChoiceDialog
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}>
            <Button onPress={() => setModalVisible(false)}>
              <Text>{tModals('Close')}</Text>
            </Button>

            <Button
              className="bg-yellow-500"
              onPress={() => {
                setModalVisible(false);
                router.push(`/projects/${projectId}/categories/${categoryId}/tasks/form?action=update&taskId=${task.id}`);
              }}>
              <Text>{tModals('Edit')}</Text>
            </Button>

            <Button
              className="bg-red-500"
              onPress={() => setConfirmationVisible(true)}>
              <Text>{tModals('Delete')}</Text>
            </Button>
          </ChoiceDialog>

          <ConfirmationDialog
            description={tModals('Are you sure?')}
            modalVisible={confirmationVisible}
            onConfirm={() => {
              setConfirmationVisible(false);
              onDelete(task.id.toString());
              setModalVisible(false);
            }}
            onDeny={() => setConfirmationVisible(false)}
          />
        </View>
        } 
    </> 
  );
}

export default function CategoryPage() {
  const { projectId, categoryId } = useLocalSearchParams<{
    projectId: string,
    categoryId: string
  }>();
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects' });
  const router = useRouter();
  const db = useSQLiteContext();
  const { colorOptions } = useThemeColor();
  const [offset, setOffset] = useState(0);

  const { data: category, isLoading: isCategoryLoading, error: categoryError } = useSuspenseQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => getCategory(db, categoryId)
  });

  const queryClient = useQueryClient();
  const fetchedCategoryId = category?.id;

  const { data: tasks, isLoading: areTasksLoading } = useQuery({
    queryKey: ['tasks', 'fromCategory', categoryId],
    queryFn: () => getActiveTasks(db, categoryId),
    enabled: !!fetchedCategoryId
  });

  const { data: finishedTasks, isLoading: areFinishedTasksLoading } = useQuery({
    queryKey: ['tasks', 'finishedTasks', 'fromCategory', categoryId],
    queryFn: () => getFinishedTasks(db, categoryId, 20, offset),
    enabled: !!fetchedCategoryId
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(db, taskId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'fromCategory'] });
    }
  });

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={category ? category.title : ''}
        headerRight={
          <CirclePlus
            onPress={() => router.push(`/projects/${projectId}/categories/${categoryId}/tasks/form`)}
            color={colorOptions.text}/>
        }
      />

      <Text className="uppercase text-base font-bold">{t('To Do')}</Text>
      {tasks && tasks.map(task => (
        <TaskEntry
          key={task.id}
          task={task}
          projectId={projectId}
          categoryId={categoryId}
          onDelete={(taskId: string) => deleteTaskMutation.mutate(taskId)}
        />            
      ))}

      <Separator />
      <Text className="uppercase text-base font-bold">{t('Completed')}</Text>

      {finishedTasks && finishedTasks.map(task => (
        <TaskEntry
          key={task.id}
          task={task}
          projectId={projectId}
          categoryId={categoryId}
          onDelete={(taskId: string) => deleteTaskMutation.mutate(taskId)}
        />            
      ))} 
    </PageWrapper>
  );
}