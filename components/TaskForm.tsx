import { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Label } from "./ui/label";
import { useFormInput } from "~/hooks/useFormInput";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import { Category } from "~/lib/database";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import DatePicker from "react-native-date-picker";
import { format } from 'date-fns';

export function TaskForm({
  projectId,
  categoryId,
  formType = 'create',
  taskId = '0' 
}: {
  projectId: string,
  categoryId: string,
  formType?: 'create' | 'edit',
  taskId?: string
}) {
  const db = useSQLiteContext();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const fields = {
    title: useFormInput('', 'title'),
    categoryId: useFormInput(categoryId, 'category_id'),
    description: useFormInput('', 'description'),
    showUntil: useFormInput(false, 'show_until'),
    until: useFormInput<Date>(new Date(), 'until'),
    important: useFormInput(false, 'important')
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const categories = await db.getAllAsync<Category>(`
          SELECT * FROM categories WHERE project_id = ?
        `, [
          projectId
        ]);
        
        setCategories(categories);
      } catch(err) {
        setErrorMessage("Fetching project's categories failed. Please try again.");
      }
    })();    
  }, []);

  const validate = (): boolean => {
    let isOkay = true;
    const fieldNames: string[] = [];

    if(fields.title.value.trim().length < 1) {
      isOkay = false;
      fieldNames.push(fields.title.name);
    }

    if(Number(fields.categoryId.value) < 1 || Number.isNaN(Number(fields.categoryId.value))) {
      isOkay = false;
      fieldNames.push(fields.categoryId.name); 
    }

    if(!isOkay)
      setErrorMessage(`Please fill all necessary fields: ${fieldNames.join(', ')}`);
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
              fields.categoryId.value,
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
              fields.important.value,
              taskId
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

      <Label>Description</Label>
      <Textarea
        placeholder="Description..."
        className="min-h-[200px]"
        value={fields.description.value}
        onChangeText={text => fields.description.setValue(text)}
      />

      <View className="flex flex-row justify-between">
        <Label>Set until date</Label>
        <Switch
          checked={fields.showUntil.value}
          onCheckedChange={fields.showUntil.setValue} />
      </View>
      
      {fields.showUntil.value &&
        <View className="flex flex-col gap-4">
          <Label>Until date</Label>
          <Text>Task's until date: {format(fields.until.value, "do LLL yyyy, HH:mm")}</Text>
          <Button
            onPress={() => {
              setTimeout(() => {
                setShowDatePicker(prev => !prev);
              }, 200);
            }}><Text>Show date picker</Text></Button>
        </View>
      }

      <View className="flex flex-row justify-between">
        <Label>Mark this task as important?</Label>
        <Switch
          checked={fields.important.value}
          onCheckedChange={fields.important.setValue} />
      </View>

      <Button
        onPress={() => save()}
        className="mt-16">
        {formType === 'create' ?
          <Text>Add category</Text>
          :
          <Text>Edit category</Text>
        }
      </Button>

      {errorMessage.length > 0 &&
        <Text>{errorMessage}</Text>}

      <View>
        <DatePicker
          modal
          open={showDatePicker}
          date={fields.until.value}
          onConfirm={(date) => {
            setShowDatePicker(false);
            fields.until.setValue(date);
          }}
          onCancel={() => {
            setShowDatePicker(false);
          }}
        />
      </View> 
    </View>
  );
}