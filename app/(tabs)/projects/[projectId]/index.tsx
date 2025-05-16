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
import { useQuery } from "@tanstack/react-query";
import { getExtendedCategories } from "~/queries/categories";
import { getProject } from "~/queries/projects";

export type ExtendedCategory = Category & {
  active_tasks_count: number
};

export default function ProjectPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects' });
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { colorOptions } = useThemeColor();
  const db = useSQLiteContext();
  const router = useRouter();
  const { data: project, isLoading: isProjectLoading, error: projectError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(db, projectId)
  });

  const { data: categories, isLoading: areCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories', 'extended', projectId],
    queryFn: () => getExtendedCategories(db, projectId)
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
            onPress={() => router.push(`/projects/${projectId}/categories/create`)} />
        } />

      {isProjectLoading && areCategoriesLoading ?
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" /> 
        </View>  
        :
        <>
          {categories && categories.map(category => (
            <Pressable
              key={category.id}
              className="w-full"
              onPress={() => router.push(`/projects/${projectId}/categories/${category.id}`)}>
              <Card
                className="w-full">
                <CardHeader
                  style={{borderColor: category.color}}
                  className="border-l-2">
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{t('Active tasks')}: {category.active_tasks_count}</CardDescription>
                </CardHeader>
              </Card>
            </Pressable>
          ))}
        </>
      }
    </PageWrapper>
  );
}