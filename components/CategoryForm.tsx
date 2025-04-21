import { useState } from "react";
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

export function CategoryForm({
  formType = 'create',
  projectId,
  categoryId = '0' 
}: {
  formType?: 'create' | 'edit',
  projectId: string,
  categoryId?: string
}) {
  const { colorScheme } = useColorScheme();
  const db = useSQLiteContext();
  const router = useRouter();
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fields = {
    title: useFormInput('', 'title'),
    color: useFormInput(colorScheme === 'dark' ? '#ffffff' : '#000000', 'color')
  };

  const validate = (): boolean => {
    let isOkay = true;
    const fieldNames: string[] = [];

    if(fields.title.value.trim().length < 1) {
      isOkay = false;
      fieldNames.push(fields.title.name);
    }

    if(fields.color.value.trim().length < 1) {
      isOkay = false;
      fieldNames.push(fields.color.name);
    }

    if(!isOkay)
      setErrorMessage(`Please fill all necessary fields: ${fieldNames.join(',')}`);
    return isOkay;
  };

  const save = () => {
    if(!validate()) return;

    (async () => {
      try {
        if(formType === 'create') {
            await db.runAsync(`
              INSERT INTO categories (project_id, title, color) VALUES(?, ?, ?)
            `, [projectId, fields.title.value, fields.color.value]); 

            router.back();
        } else {
            await db.runAsync(`
              UPDATE categories SET title = ?, color = ? WHERE id = ?
            `, [fields.title.value, fields.color.value, categoryId]); 

            router.back();
        }
      } catch(err) {
        setErrorMessage('Saving failed. Please try again.');
      }
    })();
  };

  return (
    <View className="w-full flex flex-col gap-4">
      <Label>Title</Label>
      
      <Input
        placeholder="Title"
        className="w-full"
        value={fields.title.value}
        onChangeText={text => fields.title.setValue(text)}
      />

      <Label>Color</Label>

      <View className="flex flex-row items-center gap-4">
        <Text>Picked color</Text>
        <View style={{backgroundColor: fields.color.value}} className="w-8 h-8 rounded-full"></View>
      </View>

      <Button onPress={() => setShowColorPickerModal(true)}>
        <Text>Show color picker</Text>
      </Button>

      <Button
        onPress={() => save()}
        className="mt-4">
        {formType === 'create' ?
          <Text>Add category</Text>
          :
          <Text>Edit category</Text>
        }
      </Button>

      {errorMessage.length > 0 &&
        <Text>{errorMessage}</Text>}

      <Modal
        visible={showColorPickerModal}
        animationType="slide"
        style={{backgroundColor: NAV_THEME.dark.notification}}>
        <PageWrapper className="bg-secondary flex flex-col gap-4">
          <Text className="text-xl font-bold">Pick a color</Text>

          <ColorPicker
            style={{width: '100%'}}
            value={fields.color.value}
            onCompleteJS={hex => fields.color.setValue(hex.hex)}>
            <Preview />
            <Panel1 />
            <HueSlider />
          </ColorPicker>

          <Button
            className="w-full"
            onPress={() => setShowColorPickerModal(false)}>
            <Text>Save color</Text>
          </Button>
        </PageWrapper>
      </Modal>
    </View>
  );
}