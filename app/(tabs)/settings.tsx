import { PageWrapper } from "~/components/PageWrapper";
import { ThemeSettings } from "~/components/settings/ThemeSettings";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";

export default function Settings() {
  return (
    <PageWrapper>
      <Text className="text-xl font-bold">Settings</Text>

      <Accordion
        type="multiple"
        collapsable
        className="w-full">
        <AccordionItem value="theme">
          <AccordionTrigger>
            <Text>Theme</Text>
          </AccordionTrigger>
          <AccordionContent>
            <ThemeSettings />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PageWrapper>
  );
}