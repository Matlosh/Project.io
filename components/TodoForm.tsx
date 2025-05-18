import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Text } from "./ui/text";
import { useFormInput } from "~/hooks/useFormInput";
import { useSQLiteContext } from "expo-sqlite";
import { Plus } from "~/lib/icons/Plus";
import { useThemeColor } from "~/hooks/useThemeColor";
import { Todo } from "~/lib/database";
import { resetFields } from "~/lib/utils";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertTodo, updateTodo } from "~/queries/todos";

export function TodoForm({
  taskId,
  formType = 'create',
  todoId,
}: {
  taskId: string,
  formType?: 'create' | 'update',
  todoId?: string,
}) {
  const { t: tErrors } = useTranslation('translation', { keyPrefix: 'form_errors' });

  const todoSchema = useMemo(() => z.object({
    taskId: z.string(),
    title: z.string().min(1, { message: tErrors('title.required') }),
    done: z.boolean(),
    id: z.string().optional()
  }), [tErrors]);

  const queryClient = useQueryClient();

  const db = useSQLiteContext();
  const [errorMessage, setErrorMessage] = useState('');
  const { colorOptions } = useThemeColor();
  const fields = {
    title: useFormInput('', 'title'),
    done: useFormInput(false, 'done')
  };

  const insertMutation = useMutation({
    mutationFn: (todo: z.infer<typeof todoSchema>) => insertTodo(db, todo),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      fields.title.reset();
    },
    onError: () => {
      setErrorMessage(tErrors('Saving failed. Please try again.'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: (todo: z.infer<typeof todoSchema>) => updateTodo(db, todo),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      setErrorMessage(tErrors('Saving failed. Please try again.'));
    }
  });

  const save = () => {
    const data = todoSchema.safeParse({
      taskId,
      title: fields.title.value,
      done: fields.done.value,
      id: todoId 
    });

    if(!data.success) {
      setErrorMessage(data.error.errors.map(e => e.message).join(', '));
      return;
    }

    if(formType === 'create') {
      insertMutation.mutate(data.data);
    } else {
      updateMutation.mutate(data.data);
    }
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