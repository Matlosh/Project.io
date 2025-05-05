import { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Text } from "./ui/text";
import { useFormInput } from "~/hooks/useFormInput";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import { Plus } from "~/lib/icons/Plus";
import { useThemeColor } from "~/hooks/useThemeColor";
import { Todo } from "~/lib/database";
import { resetFields } from "~/lib/utils";
import { useDynamicReload } from "~/hooks/useDynamicReload";

export function TodoForm({
  taskId,
  formType = 'create',
  onSave
}: {
  taskId: string,
  formType?: 'create' | 'update',
  onSave?: (todo: Todo) => void
}) {
  const db = useSQLiteContext();
  const [errorMessage, setErrorMessage] = useState('');
  const { colorOptions } = useThemeColor();
  const { sendDynamicReload } = useDynamicReload();
  const fields = {
    title: useFormInput('', 'title'),
    done: useFormInput(false, 'done')
  };

  const validate = (): boolean => {
    let isOkay = true;
    const fieldNames: string[] = [];

    if(fields.title.value.trim().length < 1) {
      isOkay = false;
      fieldNames.push(fields.title.name);
    }

    if(!isOkay)
      setErrorMessage(`Please fill all necessary fields: ${fieldNames.join(', ')}`);
    else
      setErrorMessage('');
    return isOkay;
  };

  const save = () => {
    if(!validate()) return;

    (async () => {
      try {
        let todoId = -1;

        if(formType === 'create') {
          const result = await db.runAsync(`
            INSERT INTO todos (task_id, title, done) VALUES(?, ?, ?)
          `, [
            taskId,
            fields.title.value,
            fields.done.value
          ]); 

          todoId = result.lastInsertRowId;
          sendDynamicReload([
            {
              key: 'todos',
              state: 'create',
              values: [todoId.toString()]
            },
            {
              key: 'tasks',
              state: 'update',
              values: [taskId]
            }
          ]);
        } else {
          const result = await db.runAsync(`
            UPDATE todos SET title = ?, done = ? WHERE id = ?
          `, [
            fields.title.value,
            fields.done.value,
            taskId
          ]); 

          todoId = result.lastInsertRowId;
          sendDynamicReload([
            {
              key: 'todos',
              state: 'update',
              values: [todoId.toString()]
            },
            {
              key: 'tasks',
              state: 'update',
              values: [taskId]
            }
          ]);
        }

        if(todoId > -1) {
          onSave && onSave({
            id: todoId,
            task_id: Number(taskId),
            title: fields.title.value,
            done: +fields.done.value
          });
          
          resetFields(fields);
        }
      } catch(err) {
        setErrorMessage('Saving failed. Please try again.');
      }
    })();
  };

  return (
    <View className="w-full flex flex-col gap-2">
      <View className="w-full flex flex-row gap-2 items-center">
        <Pressable onPress={() => save()}>
          <View className="w-10 h-10 bg-green-500 flex items-center justify-center rounded-md">
            <Plus color={colorOptions.text} />   
          </View>      
        </Pressable>

        <Input
          placeholder="Todo"
          className="flex-1 w-full"
          value={fields.title.value}
          onChangeText={text => fields.title.setValue(text)}
        />
      </View>

      {errorMessage.length > 0 &&
        <Text className="ml-12">{errorMessage}</Text>}
    </View>
  );
}