import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { useThemeColor } from "~/hooks/useThemeColor";
import { Project } from "~/lib/database";
import { CirclePlus } from "~/lib/icons/CirclePlus";

export default function Projects() {
  const { colorOptions } = useThemeColor();
  const db = useSQLiteContext();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const projects = await db.getAllAsync<Project>(`SELECT * FROM projects`);
        setProjects(projects);
      } catch(err) {}
    })();
  }, []);

  return (
    <PageWrapper>
      <TopBar
        header="Projects"
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