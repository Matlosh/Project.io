import { useTranslation } from "react-i18next";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "./dialog";

export function ChoiceDialog({
  modalVisible,
  setModalVisible,
  children 
}: {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void,
  children: React.ReactNode
}) {
  const { t: tModals } = useTranslation('translation', { keyPrefix: 'modals' });

  return (
    <Dialog
      open={modalVisible}
      onOpenChange={setModalVisible}>
      <DialogContent className="w-[300px]">
        <DialogHeader>
          <DialogDescription>
            {tModals('What do you want to do?')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className="flex flex-col gap-2">
            {children} 
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}