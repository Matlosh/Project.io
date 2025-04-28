import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { PageWrapper } from "~/components/PageWrapper";
import { TopBar } from "~/components/TopBar";
import { Category } from "~/lib/database";
import { showToast } from "~/lib/utils";

export default function CategoryPage() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await db.getFirstAsync<Category>(`
          SELECT * FROM categories WHERE id = ?
        `, categoryId);

        if(data === null) {
          showToast(`Could not find matching category.`);
          router.back();
        }

        setCategory(data);
        setLoading(false);
      } catch(err) {
        showToast(`Could not fetch category's data.`);
        router.back();
      }
    })();
  }, []);

  return (
    <PageWrapper>
      <TopBar
        showArrowBack
        header={category !== null ? category.title : ''}
      />

      {loading ?
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" /> 
        </View>  
        :
        <>
        
        </>
      }
    </PageWrapper>
  );
}