import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Platform, ToastAndroid, View } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { Text } from "~/components/ui/text";
import { Category, Project, Task } from "~/lib/database";
import { showToast } from "~/lib/utils";
import { CirclePlus } from "~/lib/icons/CirclePlus";
import { useThemeColor } from "~/hooks/useThemeColor";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";

export default function ProjectPage() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const params = useLocalSearchParams();
  const { colorOptions } = useThemeColor();
  const db = useSQLiteContext();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await db.getFirstAsync<Project>(`
          SELECT * FROM projects WHERE id = ? 
        `, [projectId])

        if(data === null) {
          showToast(`Could not find matching project.`);
          router.back();
        }

        setProject(data);
        setLoading(false);
      } catch(err) {
        showToast(`Could not fetch project's data.`);
        router.back();
      }
    })();
  }, []);

  useEffect(() => {
    if(project !== null) {
      (async () => {
        try {

        } catch(err) {
          showToast(`Cound not fetch project's tasks.`);
          router.back();
        }
      })();
    }
  }, [project]);

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={project !== null ? project.title : ''}
        headerRight={
          <DropdownMenu>
            <DropdownMenuTrigger>
              <CirclePlus
                color={colorOptions.text} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              insets={{
                top: 8,
                right: 24,
                bottom: 8,
                left: 24,
              }}
              className="mt-4">
              <DropdownMenuItem onPress={() => router.push(`/projects/${projectId}/tasks/create`)}>
                <Text>Add task</Text>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onPress={() => router.push(`/projects/${projectId}/categories/create`)}>
                <Text>Add category</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        } />

      {loading ?
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" /> 
        </View>  
        :
        <>

        </>
      }
    </PageWrapper>
  );
}