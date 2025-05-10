import { useGlobalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { UpdateContext } from "~/components/providers/UpdateProvider";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { useDynamicReload } from "~/hooks/useDynamicReload";
import { useThemeColor } from "~/hooks/useThemeColor";
import { Project } from "~/lib/database";
import { CirclePlus } from "~/lib/icons/CirclePlus";

export default function Projects() {
  const { colorOptions } = useThemeColor();
  const db = useSQLiteContext();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const { reloadEntries } = useDynamicReload();
  const { t } = useTranslation('translation');

  useEffect(() => {
    (async () => {
      try {
        const projects = await db.getAllAsync<Project>(`SELECT * FROM projects`);
        setProjects(projects);
      } catch(err) {}
    })();
  }, []);

  useEffect(() => {
    console.log('updateEntries', reloadEntries);
  }, [reloadEntries]);

  return (
    <PageWrapper>
      <TopBar
        header={t('menu.Projects')}
        headerRight={<CirclePlus
          onPress={() => router.push('/projects/create')}
          color={colorOptions.text} />} />

      {projects.map(project => (
        <Pressable
          key={project.id}
          className="w-full"
          onPress={() => router.push(`/projects/${project.id}`)}>
          <Card
            className="w-full">
            <CardHeader
              style={{borderColor: project.color}}
              className="border-l-2">
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
          </Card>
        </Pressable>
      ))}
    </PageWrapper>
  );
}