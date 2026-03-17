"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsGeneral } from "@/components/overlay/SettingsGeneral";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] h-[520px] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-fg-primary">
            환경 설정
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-6 justify-start bg-transparent border-b border-line-primary rounded-none h-auto p-0 gap-4">
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent-primary data-[state=active]:bg-transparent px-1 pb-2 text-sm"
            >
              일반
            </TabsTrigger>
            <TabsTrigger
              value="shortcuts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent-primary data-[state=active]:bg-transparent px-1 pb-2 text-sm"
            >
              단축키
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent-primary data-[state=active]:bg-transparent px-1 pb-2 text-sm"
            >
              고급
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="flex-1 overflow-y-auto px-6 py-4 mt-0">
            <SettingsGeneral />
          </TabsContent>
          <TabsContent value="shortcuts" className="flex-1 overflow-y-auto px-6 py-4 mt-0">
            <p className="text-sm text-fg-muted">단축키 설정 (준비 중)</p>
          </TabsContent>
          <TabsContent value="advanced" className="flex-1 overflow-y-auto px-6 py-4 mt-0">
            <p className="text-sm text-fg-muted">고급 설정 (준비 중)</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
