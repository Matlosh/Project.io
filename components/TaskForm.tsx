import { useEffect, useMemo, useState } from "react";
import { Modal, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Label } from "./ui/label";
import { useFormInput } from "~/hooks/useFormInput";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import { Category, Task } from "~/lib/database";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import DatePicker from "react-native-date-picker";
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertTask, updateTask } from "~/queries/tasks";

export function TaskForm({
  categoryId,
  formType = 'create',
  taskId,
  task 
}: {
  categoryId: string,
  formType?: 'create' | 'update',
  taskId?: string,
  task?: Task
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.projects' });
  const { t: tFields } = useTranslation('translation', { keyPrefix: 'form_fields' });
  const { t: tErrors } = useTranslation('translation', { keyPrefix: 'form_errors' });

  const taskSchema = useMemo(() => z.object({
    title: z.string().min(1, { message: tErrors('title.required') }),
    categoryId: z.string().min(1, { message: tErrors('categoryId.required') }),
    description: z.string().optional(),
    showUntil: z.boolean(),
    until: z.date(),
    important: z.boolean(),
    id: z.string().optional()
  }), []);

  const queryClient = useQueryClient();

  const db = useSQLiteContext();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const fields = {
    title: useFormInput(task ? task.title : '', 'title'),
    categoryId: useFormInput(categoryId, 'category_id'),
    description: useFormInput(task ? task.description : '', 'description'),
    showUntil: useFormInput(task ? !!task.is_until : false, 'show_until'),
    until: useFormInput<Date>(task ? new Date(task.until) : new Date(), 'until'),
    important: useFormInput(task ? !!task.important : false, 'important')
  };
  const [showDatePicker, setShowDatePicker] = useState(false);

  const insertMutation = useMutation({
    mutationFn: (task: z.infer<typeof taskSchema>) => insertTask(db, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      router.back();
    },
    onError: () => {
      setErrorMessage(tFields('Saving failed. Please try again.'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: (task: z.infer<typeof taskSchema>) => updateTask(db, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      router.back();
    },
    onError: () => {
      setErrorMessage(tFields('Saving failed. Please try again.'));
    }
  });

  const save = () => {
    const data = taskSchema.safeParse({
      title: fields.title.value,
      categoryId: fields.categoryId.value,
      description: fields.description.value,
      showUntil: fields.showUntil.value,
      until: fields.until.value,
      important: fields.important.value,
      id: taskId
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
    <View className="w-full flex flex-col gap-4">
      <Label>{tFields('Title')}</Label>
      <Input
        placeholder={tFields('Title')}
        className="w-full"
        value={fields.title.value}
        onChangeText={text => fields.title.setValue(text)}
      />

      <Label>{tFields('Description')}</Label>
      <Textarea
        placeholder={tFields('Description')}
        className="min-h-[200px]"
        value={fields.description.value}
        onChangeText={text => fields.description.setValue(text)}
      />

      <View className="flex flex-row justify-between">
        <Label>{tFields('Set until date')}</Label>
        <Switch
          checked={fields.showUntil.value}
          onCheckedChange={fields.showUntil.setValue} />
      </View>
      
      {fields.showUntil.value &&
        <View className="flex flex-col gap-4">
          <Label>{tFields('Until date')}</Label>
          <Text>{tFields("Task's until date")}: {format(fields.until.value, "do LLL yyyy, HH:mm")}</Text>
          <Button
            onPress={() => {
              setTimeout(() => {
                setShowDatePicker(prev => !prev);
              }, 200);
            }}><Text>{tFields('Show date picker')}</Text></Button>
        </View>
      }

      <View className="flex flex-row justify-between">
        <Label>{tFields('Mark this task as important')}?</Label>
        <Switch
          checked={fields.important.value}
          onCheckedChange={fields.important.setValue} />
      </View>

      <Button
        onPress={() => save()}
        className="mt-4">
        {formType === 'create' ?
          <Text>{t('task_form.create.Save')}</Text>
          :
          <Text>{t('task_form.update.Save')}</Text>
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