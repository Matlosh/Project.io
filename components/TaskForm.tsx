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

export function TaskForm({
  formType = 'create',
  categoryId,
  taskId = '0' 
}: {
  formType?: 'create' | 'edit',
  categoryId: string,
  taskId?: string
}) {
  const { colorScheme } = useColorScheme();
  const db = useSQLiteContext();
  const router = useRouter();
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fields = {
    title: useFormInput('', 'title'),
    description: useFormInput('', 'description'),
    until: useFormInput<Date>(new Date(), 'until'),
    important: useFormInput(false, 'important')
  };

  const validate = (): boolean => {
    let isOkay = true;
    const fieldNames: string[] = [];

    if(fields.title.value.trim().length < 1) {
      isOkay = false;
      fieldNames.push(fields.title.name);
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
              INSERT INTO tasks (category_id, title, description, until, important) VALUES(?, ?, ?, ?, ?)
            `, [
              categoryId,
              fields.title.value,
              fields.description.value,
              Math.floor(fields.until.value.getTime() / 1000),
              fields.important.value
            ]); 

            router.back();
        } else {
            await db.runAsync(`
              UPDATE tasks SET title = ?, description = ?, until = ?, important = ? WHERE id = ?
            `, [
              fields.title.value,
              fields.description.value,
              Math.floor(fields.until.value.getTime() / 1000),
              fields.important.value
            ]); 

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
    </View>
  );
}