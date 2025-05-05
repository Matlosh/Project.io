import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Text } from "../ui/text";

export function ConfirmationDialog({
  description,
  modalVisible,
  onConfirm,
  onDeny
}: {
  description: string,
  modalVisible: boolean,
  onConfirm: () => void,
  onDeny: () => void
}) {

  return (
    <Dialog
      open={modalVisible}
      onOpenChange={onDeny}>
      <DialogContent className="w-[300px]">
        <DialogHeader>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className="flex flex-col gap-2">
            <Button
              className="bg-green-500"
              onPress={onConfirm}>
              <Text>Yes</Text>
            </Button>

            <Button
              className="bg-red-500"
              onPress={onDeny}>
              <Text>No</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}