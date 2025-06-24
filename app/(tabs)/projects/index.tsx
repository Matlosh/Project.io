import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, View } from "react-native";
import { ChoiceDialog } from "~/components/ui/choice-dialog";
import { ConfirmationDialog } from "~/components/ui/confirmation-dialog";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useThemeColor } from "~/hooks/useThemeColor";
import { Project } from "~/lib/database";
import { CirclePlus } from "~/lib/icons/CirclePlus";
import { deleteProject, getProjects } from "~/queries/projects";

function ProjectEntry({
  project,
  onDelete
}: {
  project: Project,
  onDelete: (projectId: string) => void
}) {
  const { t: tModals } = useTranslation('translation', { keyPrefix: 'modals' });

  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  return (
    <View className="w-full">
      <Pressable
        key={project.id}
        className="w-full"
        onPress={() => router.push(`/projects/${project.id}`)}
        onLongPress={() => setModalVisible(true)}>
        <Card
          className="w-full">
          <CardHeader
            style={{borderColor: project.color}}
            className="border-l-2 rounded-lg">
            <CardTitle>{project.title}</CardTitle>
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
            router.push(`/projects/form?action=update&projectId=${project.id}`);
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
          onDelete(project.id.toString());
          setModalVisible(false);
        }}
        onDeny={() => setConfirmationVisible(false)}
      />
    </View>
  );
}

export default function Projects() {
  const { t } = useTranslation('translation');

  const { colorOptions } = useThemeColor();
  const db = useSQLiteContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useSuspenseQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(db)
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(db, projectId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return (
    <PageWrapper>
      <TopBar
        header={t('menu.Projects')}
        headerRight={<CirclePlus
          onPress={() => router.push('/projects/form')}
          color={colorOptions.text} />} />

      {projects && projects.map(project => (
        <ProjectEntry
          key={project.id}
          project={project}
          onDelete={() => deleteMutation.mutate(project.id.toString())}
        />
      ))}
    </PageWrapper>
  );
}