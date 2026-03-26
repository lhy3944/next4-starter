"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export function SettingsGeneral() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold text-fg-primary mb-4">일반</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-fg-secondary">언어</Label>
            <Select defaultValue="ko">
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-fg-secondary">다크 모드</Label>
            <Switch
              checked={resolvedTheme === "dark"}
              onCheckedChange={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-fg-primary mb-4">알림</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-fg-secondary">앱 알림</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-fg-secondary">이메일 알림</Label>
            <Switch />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-fg-primary mb-4">모델</h3>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-fg-secondary">기본 모델</Label>
          <Select defaultValue="gpt-4o">
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-5.4</SelectItem>
              <SelectItem value="claude-sonnet">Claude Sonnet</SelectItem>
              <SelectItem value="claude-opus">Claude Opus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
