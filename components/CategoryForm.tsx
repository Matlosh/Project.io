import { useMemo, useState } from "react";
import { Modal, View } from "react-native";
import ColorPicker, { HueSlider, OpacitySlider, Panel1, Preview, Swatches } from "reanimated-color-picker";
import { Input } from "~/components/ui/input";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { PageWrapper } from "./PageWrapper";
import { NAV_THEME } from "~/lib/constants";
import { Label } from "./ui/label";
import { useFormInput } from "~/hooks/useFormInput";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { z } from "zod"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCategory, updateCategory } from "~/queries/categories";
import { Category } from "~/lib/database";

export function CategoryForm({
  formType = 'create',
  projectId,
  categoryId,
  category
}: {
  formType?: 'create' | 'update',
  projectId: string,
  categoryId?: string,
  category?: Category
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects' });
  const { t: tFields } = useTranslation('translation', { keyPrefix: 'form_fields' });
  const { t: tErrors } = useTranslation('translation', { keyPrefix: 'form_errors' });

  const categorySchema = useMemo(() => z.object({
    projectId: z.string().min(1, { message: tErrors('projectId.required') }),
    title: z.string().min(1, { message: tErrors('title.required') }),
    color: z.string().min(1, { message: tErrors('color.required') }),
    id: z.string().optional()
  }), [tErrors]);

  const queryClient = useQueryClient();

  const { colorScheme } = useColorScheme();
  const db = useSQLiteContext();
  const router = useRouter();
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fields = {
    title: useFormInput(category ? category.title : '', 'title'),
    color: useFormInput(category ? category.color : (colorScheme === 'dark' ? '#ffffff' : '#000000'), 'color')
  };

  const insertMutation = useMutation({
    mutationFn: (category: z.infer<typeof categorySchema>) => insertCategory(db, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      router.back();
    },
    onError: () => {
      setErrorMessage(tErrors('Saving failed. Please try again.'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: (category: z.infer<typeof categorySchema>) => updateCategory(db, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      router.back();
    },
    onError: () => {
      setErrorMessage(tErrors('Saving failed. Please try again.'));
    }
  });

  const save = () => {
    const data = categorySchema.safeParse({
      projectId: projectId,
      title: fields.title.value,
      color: fields.color.value,
      id: categoryId
    }); 

    if(!data.success) {
      setErrorMessage(data.error.errors.map(e => e.message).join(', '));
      return;
    }

    if (formType === 'create') {
      insertMutation.mutate(data.data);  
    } else {
      updateMutation.mutate(data.data);
    }
  };

  return (
    <View className="w-full flex flex-col gap-4">
      <Label>{tFields('Title')}</Label>

      <Input
        placeholder={tFields('Title')}
        className="w-full"
        value={fields.title.value}
        onChangeText={text => fields.title.setValue(text)}
      />

      <Label>{tFields('Color')}</Label>

      <View className="flex flex-row items-center gap-4">
        <Text>{tFields('Picked color')}</Text>
        <View style={{ backgroundColor: fields.color.value }} className="w-8 h-8 rounded-full"></View>
      </View>

      <Button onPress={() => setShowColorPickerModal(true)}>
        <Text>{tFields('Show color picker')}</Text>
      </Button>

      <Button
        onPress={() => save()}
        className="mt-4">
        {formType === 'create' ?
          <Text>{t('category_form.create.Save')}</Text>
          :
          <Text>{t('category_form.update.Save')}</Text>
        }
      </Button>

      {errorMessage.length > 0 &&
        <Text>{errorMessage}</Text>}

      <Modal
        visible={showColorPickerModal}
        animationType="slide"
        style={{ backgroundColor: NAV_THEME.dark.notification }}>
        <PageWrapper className="bg-secondary flex flex-col gap-4">
          <Text className="text-xl font-bold">{tFields('Pick a color')}</Text>

          <ColorPicker
            style={{ width: '100%' }}
            value={fields.color.value}
            onCompleteJS={hex => fields.color.setValue(hex.hex)}>
            <Preview />
            <Panel1 />
            <HueSlider />
          </ColorPicker>

          <Button
            className="w-full"
            onPress={() => setShowColorPickerModal(false)}>
            <Text>{tFields('Save color')}</Text>
          </Button>
        </PageWrapper>
      </Modal>
    </View>
  );
}