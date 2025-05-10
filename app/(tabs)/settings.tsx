import { useTranslation } from "react-i18next";
import { PageWrapper } from "~/components/PageWrapper";
import { ThemeSettings } from "~/components/settings/ThemeSettings";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";

export default function Settings() {
  const { t } = useTranslation('translation');
  
  return (
    <PageWrapper>
      <Text className="text-xl font-bold">{t('menu.Settings')}</Text>

      <Accordion
        type="multiple"
        collapsable
        className="w-full">
        <AccordionItem value="theme">
          <AccordionTrigger>
            <Text>{t('pages.settings.Theme')}</Text>
          </AccordionTrigger>
          <AccordionContent>
            <ThemeSettings />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PageWrapper>
  );
}