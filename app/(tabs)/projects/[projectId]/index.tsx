import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Platform, Pressable, ToastAndroid, View } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { Text } from "~/components/ui/text";
import { Category, Project, Task } from "~/lib/database";
import { showToast } from "~/lib/utils";
import { CirclePlus } from "~/lib/icons/CirclePlus";
import { useThemeColor } from "~/hooks/useThemeColor";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { deleteCategory, getExtendedCategories } from "~/queries/categories";
import { getProject } from "~/queries/projects";
import { Dialog, DialogDescription, DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ChoiceDialog } from "~/components/ui/choice-dialog";
import { ConfirmationDialog } from "~/components/ui/confirmation-dialog";

export type ExtendedCategory = Category & {
  active_tasks_count: number
};

function CategoryEntry({
  category,
  onDelete
}: {
  category: ExtendedCategory,
  onDelete: (categoryId: string) => void
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects' });
  const { t: tModals } = useTranslation('translation', { keyPrefix: 'modals' });

  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false); 

  return (
    <View className="w-full">
      <Pressable
        key={category.id}
        className="w-full"
        onPress={() => router.push(`/projects/${category.project_id}/categories/${category.id}`)}
        onLongPress={() => setModalVisible(true)}>
        <Card
          className="w-full">
          <CardHeader
            style={{borderColor: category.color}}
            className="border-l-2 rounded-lg">
            <CardTitle>{category.title}</CardTitle>
            <CardDescription>{t('Active tasks')}: {category.active_tasks_count}</CardDescription>
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
            router.push(`/projects/${category.project_id}/categories/form?action=update&categoryId=${category.id}`);
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
          onDelete(category.id.toString());
          setModalVisible(false);
        }}
        onDeny={() => setConfirmationVisible(false)}
      />
    </View>
  );
}

export default function ProjectPage() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { colorOptions } = useThemeColor();
  const db = useSQLiteContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: project, isLoading: isProjectLoading, error: projectError } = useSuspenseQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getProject(db, projectId)
  });

  const { data: categories, isLoading: areCategoriesLoading, error: categoriesError } = useSuspenseQuery({
    queryKey: ['categories', 'extended', projectId],
    queryFn: () => getExtendedCategories(db, projectId)
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(db, categoryId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      showToast('Operation failed. Please try again.'); 
    }
  });

  useEffect(() => {
    if(projectError || categoriesError) {
      router.back();
    }
  }, [projectError, categoriesError]);

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={project ? project.title : ''}
        headerRight={
          <CirclePlus
            color={colorOptions.text}
            onPress={() => router.push(`/projects/${projectId}/categories/form`)} />
        } />

      {categories && categories.map(category => (
        <CategoryEntry
          key={category.id}
          category={category}
          onDelete={(categoryId: string) => deleteMutation.mutate(categoryId)} />
      ))}
    </PageWrapper>
  );
}